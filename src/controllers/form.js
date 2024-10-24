const Form = require('../models/Form.js');
const Answer = require('../models/Answer.js');
const Template = require('../models/Template.js');
const Question = require('../models/Question.js');
const connection = require('../db.js');

const createForm = async (req, res) => {
  const { userId, templateId, answers } = req.body;
  console.log(req.body);
  const transaction = await connection.transaction();
  try {
    const template = await Template.findOne({
      where: { id: templateId },
      include: [{ model: Question, as: 'questions' }],
      transaction
    });
    if (!template) {
      throw new Error('Template not found');
    }
    const form = await Form.create({
      userId,
      templateId,
      submissionTime: new Date(),
    }, { transaction });
    for (let answer of answers) {
      const { questionId, response } = answer;
      const question = template.questions.find(q => q.id === parseInt(questionId));
      if (!question) {
        throw new Error(`Invalid questionId: ${questionId}`);
      }
      if (question.questionType === 'multiple_choice') {
        if (!question.options.includes(response)) {
          throw new Error(`Invalid response for questionId: ${questionId}`);
        }
      }
      await Answer.create({
        formId: form.id,
        questionId,
        response,
      }, { transaction });
    }
    await transaction.commit();
    res.status(201).json({ message: 'Form submitted successfully', form });
  } catch (error) {
    await transaction.rollback();
    console.error('Error submitting form:', error.message);
    res.status(400).json({ error: error.message });
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
      include: {
        model: Answer,
        attributes: ['questionId', 'response'],
      },
    });
    const formsWithAnswers = forms.map(form => ({
      ...form.dataValues,
      answers: form.answers || [],
    }));
    res.status(200).json(formsWithAnswers);
  } catch (error) {
    console.error('Error fetching forms:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getFormsByUser = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'No user ID provided' });
  }
  try {
    const forms = await Form.findAll({
      where: { userId },
      include: {
        model: Answer,
        attributes: ['questionId', 'response'],
      },
    });
    const formsWithAnswers = forms.map(form => ({
      ...form.dataValues,
      answers: form.answers || [],
    }));

    if (formsWithAnswers.length === 0) {
      return res.status(404).json({ message: 'No forms found for this user.' });
    }
    return res.status(200).json(formsWithAnswers);
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
    const form = await Form.findByPk(id, {
      include: {
        model: Answer,
        attributes: ['questionId', 'response'],
      },
    });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    const formWithAnswers = {
      ...form.dataValues,
      answers: form.answers || [],
    };
    return res.status(200).json(formWithAnswers);
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