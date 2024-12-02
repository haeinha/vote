import { useState } from "react";
import { OPTION_NAMES } from "../utils/constants";

export default function VoteForm() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    employeeNumber: "",
    name: "",
    option: "",
  });
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (option: string) => {
    setSelectedOptions((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, option];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOptions.length !== 3) {
      alert("Please select exactly 3 options");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          options: selectedOptions,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          data.isUpdate
            ? "Your previous vote has been updated!"
            : "Thank you for voting!"
        );
      } else {
        alert(data.message || "Error submitting vote");
      }
    } catch (error) {
      console.log(error);
      alert("Error submitting vote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
      <div
        className="text-sm text-gray-500 mt-4"
        style={{ textAlign: "right" }}
      >
        ({selectedOptions.length}/3 선택되었습니다)
      </div>

      <div style={{ height: "40px" }}></div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "40px",
          padding: "0 24px",
          width: "90%",
          margin: "0 auto",
        }}
      >
        <input
          type="text"
          placeholder="사번을 입력해 주세요"
          required
          style={{
            flex: 1,
            padding: "16px 24px",
            fontSize: "1.125rem",
            borderRadius: "0.5rem",
            border: "1px solid #d1d5db",
            outline: "none",
          }}
          value={formData.employeeNumber}
          onChange={(e) =>
            setFormData({ ...formData, employeeNumber: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="이름을 입력해 주세요"
          required
          style={{
            flex: 1,
            padding: "16px 24px",
            fontSize: "1.125rem",
            borderRadius: "0.5rem",
            border: "1px solid #d1d5db",
            outline: "none",
          }}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <button
          type="submit"
          disabled={loading || selectedOptions.length !== 3}
          style={{
            padding: "16px 48px",
            fontSize: "1.125rem",
            borderRadius: "0.5rem",
            backgroundColor: "#4f46e5",
            color: "white",
            opacity: loading || selectedOptions.length !== 3 ? 0.5 : 1,
            cursor:
              loading || selectedOptions.length !== 3
                ? "not-allowed"
                : "pointer",
          }}
        >
          {loading ? "Submitting..." : "Vote"}
        </button>
      </div>

      <div style={{ height: "40px" }}></div>

      <div className="mb-40">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            maxWidth: "100%",
            padding: "0 24px",
          }}
        >
          {Object.values(OPTION_NAMES).map((name) => (
            <label
              key={name}
              className="vote-option-label"
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "1.125rem",
                padding: "12px 8px",
                cursor: "pointer",
                borderRadius: "8px",
                transition: "background-color 0.2s",
              }}
            >
              <input
                type="checkbox"
                value={name}
                checked={selectedOptions.includes(name)}
                onChange={() => handleCheckboxChange(name)}
                style={{
                  marginRight: "12px",
                  width: "20px",
                  height: "20px",
                }}
              />
              {name}
            </label>
          ))}
        </div>
        <div style={{ height: "30px" }}></div>
      </div>
    </form>
  );
}
