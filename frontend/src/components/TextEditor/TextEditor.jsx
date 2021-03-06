import React, { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Quill from "quill";
import "./TextEditor.css";
import "quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";

const socketServerUrl = "https://googledocs-backend.herokuapp.com";
// const socketServerUrl = 'http://localhost:5001';
const SAVE_INTERVAL_MS = 2000;
const TOOL_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const TextEditor = () => {
  const { documentId } = useParams();

  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  useEffect(() => {
    const s = io.connect(socketServerUrl);
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    //put editor inside the the wrapper Ref so that we clean the whole
    //wrapper in the return of the useEffect
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOL_OPTIONS },
    });
    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
};

export default TextEditor;
