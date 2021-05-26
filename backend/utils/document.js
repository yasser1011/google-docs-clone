const Document = require("../models/Document");

const findOrCreateDocument = async (documentId) => {
  if (documentId == null) return;

  const document = await Document.findById(documentId);

  if (document) return document;

  return await Document.create({ _id: documentId, data: "" });
};

module.exports = { findOrCreateDocument };
