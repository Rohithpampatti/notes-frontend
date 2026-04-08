import API from "../api";

// CREATE
export const createNote = async (title, content, tags = [], reminder = false, reminderDate = null) => {
    try {
        const res = await API.post("/notes", {
            title,
            content,
            tags,
            reminder,
            reminderDate
        });
        return res.data;
    } catch (error) {
        console.error("Create note error:", error.response?.data || error.message);
        throw error;
    }
};

// GET ALL
export const getNotes = async () => {
    try {
        const res = await API.get("/notes");
        return res.data;
    } catch (error) {
        console.error("Get notes error:", error.response?.data || error.message);
        throw error;
    }
};

// GET SINGLE NOTE
export const getNoteById = async (id) => {
    try {
        const res = await API.get(`/notes/${id}`);
        return res.data;
    } catch (error) {
        console.error("Get note error:", error.response?.data || error.message);
        throw error;
    }
};

// UPDATE
export const updateNote = async (id, title, content, tags = [], reminder = false, reminderDate = null) => {
    try {
        const res = await API.put(`/notes/${id}`, {
            title,
            content,
            tags,
            reminder,
            reminderDate
        });
        return res.data;
    } catch (error) {
        console.error("Update note error:", error.response?.data || error.message);
        throw error;
    }
};

// DELETE
export const deleteNote = async (id) => {
    try {
        await API.delete(`/notes/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Delete note error:", error.response?.data || error.message);
        throw error;
    }
};

// SHARE NOTE
export const shareNote = async (id, email, role = "viewer") => {
    try {
        const res = await API.post(`/notes/${id}/share`, { email, role });
        return res.data;
    } catch (error) {
        console.error("Share note error:", error.response?.data || error.message);
        throw error;
    }
};

// CREATE PUBLIC LINK
export const createPublicLink = async (id) => {
    try {
        const res = await API.post(`/notes/${id}/public`);
        return res.data;
    } catch (error) {
        console.error("Create public link error:", error.response?.data || error.message);
        throw error;
    }
};

// SET REMINDER
export const setReminder = async (id, date) => {
    try {
        const res = await API.post(`/notes/${id}/reminder`, { date });
        return res.data;
    } catch (error) {
        console.error("Set reminder error:", error.response?.data || error.message);
        throw error;
    }
};

// AI SUMMARY
export const getAISummary = async (content) => {
    try {
        const res = await API.post("/notes/ai/summarize", { content });
        return res.data;
    } catch (error) {
        console.error("AI Summary error:", error.response?.data || error.message);
        throw error;
    }
};

// SUGGEST TITLE
export const suggestTitle = async (content) => {
    try {
        const res = await API.post("/notes/ai/suggest-title", { content });
        return res.data;
    } catch (error) {
        console.error("Suggest title error:", error.response?.data || error.message);
        throw error;
    }
};

// EXTRACT TAGS
export const extractTags = async (content) => {
    try {
        const res = await API.post("/notes/ai/extract-tags", { content });
        return res.data;
    } catch (error) {
        console.error("Extract tags error:", error.response?.data || error.message);
        throw error;
    }
};