// external imports
const createError = require("http-errors");
// internal imports
const User = require("../models/People");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const escape = require("../utilities/escape");
const imageUploader = require("../utilities/Imageuploader");
// get inbox page
async function getInbox(req, res, next) {
  try {
    const conversations = await Conversation.find({
      $or: [
        { "creator.id": req.user.userid },
        { "participant.id": req.user.userid },
      ],
    });

    res.locals.data = conversations;
    res.render("pages/inbox");
  } catch (err) {
    next(err);
  }
}

// search user
async function searchUser(req, res, next) {
  const user = req.body.user;
  const searchQuery = user.replace("+88", "");

  const name_search_regex = new RegExp(escape(searchQuery), "i");
  const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery));
  const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");

  try {
    if (searchQuery !== "") {
      const users = await User.find(
        {
          $or: [
            {
              name: name_search_regex,
            },
            {
              mobile: mobile_search_regex,
            },
            {
              email: email_search_regex,
            },
          ],
        },
        "name avatar"
      );

      res.json(users);
    } else {
      throw createError("You must provide some text to search!");
    }
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

// add conversation
async function addConversation(req, res, next) {
  try {
    isConversationExists = await Conversation.findOne({
      $or: [
        {
          "creator.id": req.user.userid,
          "participant.id": req.body.id,
        },
        {
          "creator.id": req.body.id,
          "participant.id": req.user.userid,
        },
      ],
    });

    if (isConversationExists) {
      throw createError("Conversation already exists!");
    }

    const newConversation = new Conversation({
      creator: {
        id: req.user.userid,
        name: req.user.name,
        avatar: req.user.avatar || null,
      },
      participant: {
        name: req.body.participant,
        id: req.body.id,
        avatar: req.body.avatar || null,
      },
    });

    const result = await newConversation.save();
    res.status(200).json({
      message: "Conversation was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

// get messages of a conversation
async function getMessages(req, res, next) {
  try {
    const messages = await Message.find({
      conversation_id: req.params.conversation_id,
    }).sort("-createdAt");

    const { participant } = await Conversation.findById(
      req.params.conversation_id
    );

    res.status(200).json({
      data: {
        messages: messages,
        participant,
      },
      user: req.user.userid,
      conversation_id: req.params.conversation_id,
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknows error occured!",
        },
      },
    });
  }
}

// send new message
async function sendMessage(req, res, next) {
  try {
    if (req.body.message || req.files || req.files?.attachment?.length > 0) {
      try {
        // save message text/attachment in database
        let attachments = null;
        // console.log("dd", req.files.attachment);

        if (req.files?.attachment) {
          if (Array.isArray(req.files.attachment)) {
            const validFiles = req.files.attachment.filter(
              (file) => file.size > 0
            );
            if (validFiles.length > 0) {
              attachments = await imageUploader(validFiles, "messages", true);
            }
          } else if (req.files.attachment.size > 0) {
            attachments = await imageUploader(req.files.attachment, "messages");
          }
        }
        const newMessage = new Message({
          text: req.body.message,
          attachment: attachments,
          sender: {
            id: req.user.userid,
            name: req.user.name,
            avatar: req.user.avatar || null,
          },
          receiver: {
            id: req.body.receiverId,
            name: req.body.receiverName,
            avatar: req.body.avatar || null,
          },
          conversation_id: req.body.conversationId,
        });

        const result = await newMessage.save();

        // emit socket event
        global.io.emit("new_message", {
          message: {
            conversation_id: req.body.conversationId,
            sender: {
              id: req.user.userid,
              name: req.user.name,
              avatar: req.user.avatar || null,
            },
            message: req.body.message,
            attachment: attachments,
            date_time: result.date_time,
          },
        });

        return res.status(200).json({
          message: "Successful!",
          data: result,
        });
      } catch (err) {
        console.error("Error saving message:", err);
        return res.status(500).json({
          errors: {
            common: {
              msg: err.message,
            },
          },
        });
      }
    } else {
      console.warn("Message text or attachment is missing!");
      return res.status(400).json({
        errors: {
          common: "Message text or attachment is required!",
        },
      });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

async function deleteMessages(req, res, next) {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findOne({
      _id: conversationId,
    });

    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found" });
    }
    await Conversation.deleteOne({ _id: conversationId });
    res.status(200).json({
      success: "success",
      message: "Conversation deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getInbox,
  searchUser,
  addConversation,
  getMessages,
  sendMessage,
  deleteMessages,
};
