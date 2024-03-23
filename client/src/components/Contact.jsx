import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/auth/get/${listing.owner}`);
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        setLandlord(data);
      } catch (error) {}
    };
    fetchLandlord();
  }, []);
  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
            <textarea
              name="message"
              id="message"
              cols="30"
              rows="3"
              value={message}
              onChange={handleChange}
              placeholder="Enter your message here"
              className="w-full border p-3 rounded-lg "
            ></textarea>
          </p>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center rounded-lg p-3 uppercase hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
};

export default Contact;
