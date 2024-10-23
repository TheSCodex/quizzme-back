const Template = require("../models/Template.js");
const Question = require("../models/Question.js");
const User = require("../models/User.js");
const Form = require("../models/Form.js");
const Answer = require("../models/Answer.js");
const Tag = require("../models/Tag.js");

const validateQuestionFormat = (question) => {
  const { questionText, questionType, options, minValue, maxValue } = question;
  if (!questionText || !questionType) {
    return {
      isValid: false,
      message: "Each question must have content and type defined",
    };
  }
  const allowedTypes = ["text", "multiple_choice", "checkbox", "number"];
  if (!allowedTypes.includes(questionType)) {
    return {
      isValid: false,
      message: `Invalid question type '${questionType}' provided. Allowed types are: ${allowedTypes.join(", ")}`,
    };
  }
  switch (questionType) {
    case "multiple_choice":
      if (!Array.isArray(options) || options.length === 0) {
        return {
          isValid: false,
          message: "Multiple choice questions must have an array of options",
        };
      }
      const uniqueOptions = new Set(options);
      if (uniqueOptions.size !== options.length) {
        return {
          isValid: false,
          message: "Multiple choice options must be unique",
        };
      }
      break;
    case "checkbox":
      if (!Array.isArray(options) || options.length === 0) {
        return {
          isValid: false,
          message: "Multiple choice or checkbox questions must have an array of options",
        };
      }
      break;
    case "number":
      if (minValue !== undefined && typeof minValue !== "number") {
        return {
          isValid: false,
          message: "Number questions must have a valid minimum value",
        };
      }
      if (maxValue !== undefined && typeof maxValue !== "number") {
        return {
          isValid: false,
          message: "Number questions must have a valid maximum value",
        };
      }
      if (minValue !== undefined && maxValue !== undefined && minValue >= maxValue) {
        return {
          isValid: false,
          message: "Minimum value must be less than maximum value",
        };
      }
      break;
    case "text":
      break;
    default:
      return {
        isValid: false,
        message: `Unknown question type '${questionType}' provided`,
      };
  }
  
  return { isValid: true };
};

const createTemplate = async (req, res) => {
  const { userId, title, description, accessType, questions, tags, category } =
    req.body;
  if (!userId || !title || !description) {
    return res
      .status(400)
      .json({
        error: {
          message:
            "One or more items necessary to create the Template are missing",
        },
      });
  }
  if (questions && Array.isArray(questions)) {
    for (let question of questions) {
      const { isValid, message } = validateQuestionFormat(question);
      if (!isValid) {
        return res.status(422).json({ error: { message } }); // 422 for validation errors
      }
    }
  }
  const transaction = await sequelize.transaction();
  try {
    const newTemplate = await Template.create(
      {
        title,
        description,
        accessType,
        createdBy: userId,
        category: category || "other",
      },
      { transaction }
    );
    if (tags && Array.isArray(tags)) {
      for (let tagName of tags) {
        let [tag, created] = await Tag.findOrCreate({
          where: { name: tagName },
          defaults: { name: tagName },
          transaction,
        });
        await newTemplate.addTag(tag, { transaction });
      }
    }
    if (questions && Array.isArray(questions)) {
      for (let question of questions) {
        await Question.create(
          {
            ...question,
            templateId: newTemplate.id,
          },
          { transaction }
        );
      }
    }
    await transaction.commit();
    return res.status(201).json(newTemplate);
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating template:", error);
    return res
      .status(500)
      .json({
        error: {
          message: "An internal server error occurred. Please try again later.",
        },
      });
  }
};

const getTemplates = async (req, res) => {
  try {
    const templates = await Template.findAll({
      include: [
        {
          model: Tag,
          through: { attributes: [] },
        },
        {
          model: Question,
        },
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    if (templates.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }
    return res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTemplatesByUser = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "No user id provided" });
  }
  try {
    const templates = await Template.findAll({
      where: { createdBy: userId },
      include: [
        {
          model: Tag,
          through: { attributes: [] },
        },
        {
          model: Question,
        },
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    if (templates.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found matching provided user" });
    }
    return res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTemplateById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ message: "No id was provided to recover a template" });
  }
  try {
    const template = await Template.findByPk(id, {
      include: [
        {
          model: Question,
        },
        {
          model: Tag,
          through: { attributes: [] },
        },
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    return res.status(200).json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateTemplate = async (req, res) => {
  const { id } = req.params;
  const { userId, title, description, access, questions, tags, category } =
    req.body;
  if (!id) {
    return res
      .status(400)
      .json({ message: "No id was provided to update a template" });
  }
  if (!userId || !title || !description || !questions) {
    return res
      .status(400)
      .json({ message: "One or more items missing are missing" });
  }
  if (questions && Array.isArray(questions)) {
    for (let question of questions) {
      const { isValid, message } = validateQuestionFormat(question);
      if (!isValid) {
        return res.status(400).json({ message });
      }
    }
  }
  try {
    const template = await Template.findOne({
      where: { id, createdBy: userId },
    });
    if (!template) {
      return res
        .status(404)
        .json({ message: "Template not found or access denied" });
    }
    await template.update({
      title,
      description,
      access,
      category: category || template.category,
    });
    if (tags && Array.isArray(tags)) {
      await template.setTags([]);
      for (let tagName of tags) {
        let [tag, created] = await Tag.findOrCreate({
          where: { name: tagName },
          defaults: { name: tagName },
        });
        await template.addTag(tag);
      }
    }
    if (questions && Array.isArray(questions)) {
      await Question.destroy({ where: { templateId: template.id } });
      for (let question of questions) {
        await Question.create({
          ...question,
          templateId: template.id,
        });
      }
    }
    return res.status(200).json(template);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteTemplate = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ message: "No id was provided to delete a template" });
  }
  try {
    const template = await Template.findOne({
      where: { id, createdBy: userId },
    });
    if (!template) {
      return res
        .status(404)
        .json({ message: "Template not found or access denied" });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (template.createdBy !== userId && user.role !== "admin") {
      return res.status(403).json({
        message: "You are not authorized to delete this template",
      });
    }
    await template.destroy();
    return res.status(200).json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error("Error deleting template:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTemplateStatistics = async (req, res) => {
  const { templateId } = req.params;
  if (!templateId) {
    return res.status(400).json({ message: "No templateId provided" });
  }
  try {
    const totalForms = await Form.count({
      where: { templateId },
    });
    if (totalForms === 0) {
      return res.status(404).json({
        message: "No forms have been submitted for this template.",
      });
    }
    const questions = await Question.findAll({
      where: { templateId },
    });
    const questionStatistics = [];
    for (let question of questions) {
      const answers = await Answer.findAll({
        where: { questionId: question.id },
      });
      if (question.type === "text" || question.type === "number") {
        questionStatistics.push({
          question: question.content,
          type: question.type,
          totalAnswers: answers.length,
        });
        continue;
      }
      const optionCounts = {};
      for (let answer of answers) {
        const response = JSON.parse(answer.response);
        if (Array.isArray(response)) {
          response.forEach((option) => {
            if (!optionCounts[option]) optionCounts[option] = 0;
            optionCounts[option]++;
          });
        } else {
          if (!optionCounts[response]) optionCounts[response] = 0;
          optionCounts[response]++;
        }
      }
      const totalAnswers = answers.length;
      const optionPercentages = {};
      Object.keys(optionCounts).forEach((option) => {
        optionPercentages[option] =
          ((optionCounts[option] / totalAnswers) * 100).toFixed(2) + "%";
      });
      questionStatistics.push({
        question: question.content,
        type: question.type,
        totalAnswers,
        optionPercentages,
      });
    }
    return res.status(200).json({
      totalForms,
      questionStatistics,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  getTemplatesByUser,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  getTemplateStatistics,
};
