import { post } from "../../utils/request";

export const sendQuestion = async (question) => {
    console.log("log test: ",question);
    return await post("/api/chatbot/ask",  question);
};
