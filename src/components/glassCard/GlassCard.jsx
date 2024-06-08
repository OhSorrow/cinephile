import react from "react";
import "./styles.scss";

const GlassCard = ({ title, icon: Icon }) => {
  return (
    <div className="glass-card">
      <Icon></Icon>
      <h2 className="glass-card-title">{title}</h2>
    </div>
  );
};

export default GlassCard;
