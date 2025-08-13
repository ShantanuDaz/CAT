import { useState, useEffect } from "react";
import { TypeWriter } from "react-simplicity-lib";

const Footer = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("https://dummyjson.com/quotes/random");
        const data = await response.json();
        setQuote(data.quote);
        setAuthor(data.author);
      } catch (error) {
        setQuote("If you want to lift yourself up, lift up someone else.");
        setAuthor("Booker T. Washington");
      }
    };

    fetchQuote();
    const interval = setInterval(fetchQuote, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-gray-800 text-white p-0.5 text-center">
      {quote && (
        <>
          <TypeWriter
            text={quote}
            baseSpeed={400}
            className="text-gray-300 block text-sm italic"
          />
          <div className="text-xs text-gray-400">- {author}</div>
        </>
      )}
    </footer>
  );
};

export default Footer;
