const Form = require('../models/Form.js');
const Answer = require('../models/Answer.js');
const Template = require('../models/Template.js');
const Question = require('../models/Question.js');

const createForm = async (req, res) => {
  const { userId, templateId, answers } = req.body;
  if (!userId || !templateId || !answers) {
    return res.status(400).json({
      message: 'One or more items necessary to create the form are missing.',
    });
  }
  try {
    const template = await Template.findByPk(templateId, {
      include: Question,
    });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    const newForm = await Form.create({
      userId,
      templateId,
    });
    for (let answer of answers) {
      const question = template.Questions.find(
        (q) => q.id === answer.questionId
      );
      if (!question) {
        return res.status(400).json({
          message: `Question with id ${answer.questionId} not found for this template.`,
        });
      }
      await Answer.create({
        formId: newForm.id,
        questionId: answer.questionId,
        response: answer.response,
      });
    }
    return res
      .status(201)
      .json({ message: 'Form created successfully', form: newForm });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getFormsByTemplate = async (req, res) => {
  const { templateId } = req.params;
  if (!templateId) {
    return res.status(400).json({ message: 'No template ID provided' });
  }
  try {
    const forms = await Form.findAll({
      where: { templateId },
      include: Answer,
    });
    if (forms.length === 0) {
      return res
        .status(404)
        .json({ message: 'No forms found for this template.' });
    }
    return res.status(200).json(forms);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getFormsByUser = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'No user ID provided' });
  }
  try {
    const forms = await Form.findAll({ where: { userId }, include: Answer });
    if (forms.length === 0) {
      return res.status(404).json({ message: 'No forms found for this user.' });
    }
    return res.status(200).json(forms);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getFormById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'No form ID provided' });
  }
  try {
    const form = await Form.findByPk(id, { include: Answer });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    return res.status(200).json(form);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateForm = async (req, res) => {
  const { id } = req.params;
  const { answers } = req.body;
  if (!id || !answers) {
    return res
      .status(400)
      .json({ message: 'Form ID and answers are required for update.' });
  }
  try {
    const form = await Form.findByPk(id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    for (let answer of answers) {
      const answerRecord = await Answer.findOne({
        where: { formId: id, questionId: answer.questionId },
      });
      if (answerRecord) {
        await answerRecord.update({ response: answer.response });
      } else {
        return res.status(400).json({
          message: `No answer found for question ${answer.questionId} in this form.`,
        });
      }
    }
    return res.status(200).json({ message: 'Form updated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteForm = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'No form ID provided' });
  }
  try {
    const form = await Form.findByPk(id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    await form.destroy();
    return res.status(200).json({ message: 'Form deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createForm,
  getFormsByTemplate,
  getFormsByUser,
  getFormById,
  updateForm,
  deleteForm,
};