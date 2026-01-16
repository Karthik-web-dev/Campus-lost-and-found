import React from "react";
import emojiData from "unicode-emoji-json";


const CATEGORIES = [
  "Smileys & Emotion",
  "People & Body",
  "Animals & Nature",
  "Food & Drink",
  "Activities",
];

export default function EmojiTab({ onEmojiSelect }) {
  const [activeCategory, setActiveCategory] = React.useState(CATEGORIES[0]);


  const categoryEmojis = React.useMemo(() => {
    return CATEGORIES.map((cat) => {
      const firstEmoji = Object.entries(emojiData).find(
        ([emoji, info]) => info.group === cat
      )?.[0];
      return { category: cat, icon: firstEmoji || "❓" };
    });
  }, []);

  // Filter emojis for the active category
  const activeEmojis = React.useMemo(() => {
    return Object.entries(emojiData)
      .filter(([emoji, info]) => info.group === activeCategory)
      .map(([emoji]) => emoji);
  }, [activeCategory]);

  return (
    <div className="emoji-picker">
      {/* Tabs */}
      <div className="emoji-tabs">
        {categoryEmojis.map(({ category, icon }) => (
          <div
            key={category}
            className={`emoji-tab ${category === activeCategory ? "active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {icon}
          </div>
        ))}
      </div>


      <div className="emoji-grid active">
        {activeEmojis.map((emoji) => (
          <span
            key={emoji}
            className="emoji"
            onClick={() => onEmojiSelect?.(emoji)}
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
}
