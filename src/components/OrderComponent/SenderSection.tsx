import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/useAuth";

interface SenderProps {
  onSenderNameChange: (name: string) => void;
}

const Sender = ({ onSenderNameChange }: SenderProps) => {
  const { user, isLoggedIn } = useAuth();

  const initialSenderName = isLoggedIn && user?.name ? user.name : "example";

  const [senderName, setSenderName] = useState<string>(initialSenderName);

  useEffect(() => {
    onSenderNameChange(senderName);
  }, [onSenderNameChange, senderName]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setSenderName(newName);
    onSenderNameChange(newName);
  };

  return (
    <div className="bg-white rounded-lg  p-4 mb-4">
      <h2 className="text-xl font-bold mb-3">보내는 사람</h2>
      <div className="mb-3">
        <label
          htmlFor="senderName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          이름
        </label>
        <input
          type="text"
          id="senderName"
          value={senderName}
          onChange={handleNameChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          * 실제 선물 발송 시 발신자이름으로 반영되는 정보입니다.
        </p>
      </div>
    </div>
  );
};

export default Sender;
