"use client";

import React, { useState, useEffect } from "react";

const IndexPage = () => {
  const [message, setMessage] = useState([]);

  const BASE_URL = "http://localhost:8000";

  useEffect(() => {
    fetch(BASE_URL + "/")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h1>Journal Entries</h1>
      <h2>{message}</h2>
    </div>
  );
};

export default IndexPage;
