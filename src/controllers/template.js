import Template from "../models/Template.js";
import Question from "../models/Question.js";
import User from "../models/User.js";

const validateQuestionFormat = (question) => {
  const { content, type, options, min, max } = question;
  if (!content || !type) {
    return {
      isValid: false,
      message: "Each question must have content and type defined",
    };
  }
  const allowedTypes = ["text", "multiple_choice", "checkbox", "number"];
  if (!allowedTypes.includes(type)) {
    return {
      isValid: false,
      message: `Invalid question type '${type}' provided. Allowed types are: ${allowedTypes.join(
        ", "
      )}`,
    };
  }
  switch (type) {
    case "multiple_choice":
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
      if (min !== undefined && typeof min !== "number") {
        return {
          isValid: false,
          message: "Number questions must have a valid minimum value",
        };
      }
      if (max !== undefined && typeof max !== "number") {
        return {
          isValid: false,
          message: "Number questions must have a valid maximum value",
        };
      }
      if (min !== undefined && max !== undefined && min >= max) {
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
        message: `Unknown question type '${type}' provided`,
      };
  }
  return { isValid: true };
};

export const createTemplate = async (req, res) => {
  const { userId, title, description, accessType, questions, tags, category } =
    req.body;
  if (!userId || !title || !description) {
    return res.status(400).json({
      message: "One or more items necessary to create the Template are missing",
    });
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
    const newTemplate = await Template.create({
      title: title,
      description: description,
      accessType: accessType,
      createdBy: userId,
      tags: Array.isArray(tags) ? tags : [],
      category: category || "other",
    });
    if (questions && Array.isArray(questions)) {
      for (let question of questions) {
        await Question.create({
          ...question,
          templateId: newTemplate.id,
        });
      }
    }
    return res.status(201).json(newTemplate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTemplatesByUser = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "No user id provided" });
  }
  try {
    const templates = await Template.findAll({ where: { createdBy: userId } });
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

export const getTemplateById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ message: "No id was provided to recover a template" });
  }
  try {
    const template = await Template.findByPk(id, {
      include: Question,
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

export const updateTemplate = async (req, res) => {
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
      tags: tags ? JSON.stringify(tags) : template.tags,
      category: category || template.category,
    });
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

export const deleteTemplate = async (req, res) => {
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

export const getTemplateStatistics = async (req, res) => {
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
