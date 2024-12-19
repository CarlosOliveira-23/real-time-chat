const Message = require('../models/messageModel')

const getMessages = async () => {
    try {
        const messages = await Messege.find().sort({ timestamp: 1});
        return messeges;
    } catch (err) {
        console.error('Erro ao recuperar mensagens:', err);
        throw new Error('Erro ao recuperar mensagens');
    }
};

const saveMessage = async (sensitiveHeaders, message) => {
    try {
        const newMessage = await Message({ sender, message });
        await newMessage.save();
        return newMessage;
    } catch (err) {
        console.error('Erro ao salvar mensagem:', err);
        throw new Error('Erro ao salvar mensagem');
    }
};

module.exports = { getMessages, saveMessage };