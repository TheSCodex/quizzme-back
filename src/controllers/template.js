const Template = require("../models/Template.js");
const Question = require("../models/Question.js");
const User = require("../models/User.js");
const Form = require("../models/Form.js");
const Answer = require("../models/Answer.js");
const Tag = require("../models/Tag.js");
const TemplateAccess = require("../models/TemplateAccess.js");
const connection = require("../db.js");

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
      message: `Invalid question type '${questionType}' provided. Allowed types are: ${allowedTypes.join(
        ", "
      )}`,
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
          message:
            "Multiple choice or checkbox questions must have an array of options",
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
      if (
        minValue !== undefined &&
        maxValue !== undefined &&
        minValue >= maxValue
      ) {
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
  const { userId, title, description, accessType, questions, tags, category, imageUrl, authorizedUsers } =
    req.body;
  console.log(req.body);
  if (!userId || !title || !description) {
    return res.status(400).json({
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
        return res.status(422).json({ error: { message } });
      }
    }
  }
  const transaction = await connection.transaction();
  try {
    const newTemplate = await Template.create(
      {
        title,
        description,
        accessType,
        createdBy: userId,
        category: category || "other",
        picture: imageUrl || "https://res.cloudinary.com/djgvhqhdo/image/upload/v1729743174/data-2311261_1280_vfciyl.png",
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
    if (authorizedUsers && Array.isArray(authorizedUsers)) {
      for(let userId of authorizedUsers) {
        await TemplateAccess.create(
          {
            userId,
            templateId: newTemplate.id,
          },
          {transaction}
        )
      }
    }
    await transaction.commit();
    return res.status(201).json(newTemplate);
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating template:", error);
    return res.status(500).json({
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
          as: "questions",
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
          as: "questions",
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
          as: "questions",
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

    const allAnswers = await Answer.findAll({
      where: {
        questionId: questions.map(q => q.id),
      },
    });
    const totalAnswers = allAnswers.length;
    let mostRepeatedAnswer = null;
    let mostChosenAnswer = null;
    let optionPercentages = null;
    const answerCounts = {};
    const optionCounts = {};
    let totalMultipleChoiceAnswers = 0;
    for (let answer of allAnswers) {
      const response = answer.response;
      const question = questions.find(q => q.id === answer.questionId);
      if (question.questionType === "text") {
        if (!answerCounts[response]) {
          answerCounts[response] = 0;
        }
        answerCounts[response]++;
      }
      if (question.questionType === "multiple_choice") {
        totalMultipleChoiceAnswers++;
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(response);
        } catch (e) {
          parsedResponse = response;
        }
        if (Array.isArray(parsedResponse)) {
          parsedResponse.forEach((option) => {
            if (!optionCounts[option]) optionCounts[option] = 0;
            optionCounts[option]++;
          });
        } else {
          if (!optionCounts[parsedResponse]) optionCounts[parsedResponse] = 0;
          optionCounts[parsedResponse]++;
        }
      }
    }

    mostRepeatedAnswer = Object.keys(answerCounts).reduce((a, b) =>
      answerCounts[a] > answerCounts[b] ? a : b
    );

    optionPercentages = {};
    Object.keys(optionCounts).forEach((option) => {
      optionPercentages[option] =
        ((optionCounts[option] / totalMultipleChoiceAnswers) * 100).toFixed(2) + "%";
    });

    mostChosenAnswer = Object.keys(optionCounts).reduce((a, b) =>
      optionCounts[a] > optionCounts[b] ? a : b
    );

    return res.status(200).json({
      totalForms,
      totalAnswers,
      mostRepeatedAnswer,
      mostChosenAnswer,
      optionPercentages,
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
