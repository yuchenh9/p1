import React, { useState,useEffect } from 'react';

export default function LogBox(props) {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 8;
  const totalPages = Math.ceil(messages.length / messagesPerPage);
  useEffect(() => {
    setMessages(props.messages);
  }, [props.messages]);
  function handleNextPage() {
    setCurrentPage(currentPage + 1);
  }

  function handlePrevPage() {
    setCurrentPage(currentPage - 1);
  }



  const startIndex = (currentPage - 1) * messagesPerPage;
  const endIndex = startIndex + messagesPerPage;
  const currentMessages = messages.slice(startIndex, endIndex);

  return (
    <div>
      <h2>Message Display</h2>
      <textarea rows={8} value={currentMessages.join('\n')} readOnly />
      <div>
        {currentPage > 1 && (
          <button onClick={handlePrevPage}>Previous Page</button>
        )}
        {currentPage < totalPages && (
          <button onClick={handleNextPage}>Next Page</button>
        )}
      </div>
    </div>
  );
}
