import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiLogOut, FiLock, FiCalendar, FiMapPin, FiPhone, FiGlobe, FiBriefcase, FiSave, FiEdit2, FiX } from "react-icons/fi";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // ... Fetch logic remains the same ...
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setUserData(data.user);
          setFormData(data.user); // Initialize form state
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
  setLoading(true); // Optional: add a global loading state or specific button state
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/profile", {
      method: "PUT", // Ensure your backend route supports PUT/PATCH
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success) {
      setUserData(formData); // Update local state with new data
      setIsEditing(false);   // Switch back to view mode
      alert("Profile updated successfully!");
    } else {
      alert(result.message || "Failed to update profile");
    }
  } catch (err) {
    console.error("Update error:", err);
    alert("An error occurred while saving.");
  } finally {
    setLoading(false);
  }
};

const handleCancel = () => {
  setFormData(userData); // Revert form data to the last saved state
  setIsEditing(false);   // Close edit mode
};

  if (loading) return <div style={styles.pageContainer}>Loading...</div>;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
  <h1 style={styles.title}>Account Overview</h1>
  
 <div style={styles.actionGroup}>
  {isEditing ? (
    <>
      <button onClick={handleCancel} style={styles.cancelBtn}>
        <FiX /> Cancel Changes
      </button>
      <button onClick={handleSave} style={styles.saveBtn}>
        <FiSave /> Save Changes
      </button>
    </>
  ) : (
    <button onClick={() => setIsEditing(true)} style={styles.saveBtn}>
      <FiEdit2 /> Edit Profile
    </button>
  )}
</div>
</div>

      <div style={styles.card}>
        <div style={styles.gridForm}>
          <EditableField label="FULL NAME" name="full_name" value={formData.full_name} isEditing={isEditing} onChange={handleChange} />
          <EditableField label="EMAIL" name="email" value={formData.email} isEditing={isEditing} onChange={handleChange} />
          <EditableField label="PHONE" name="phone" value={formData.phone} isEditing={isEditing} onChange={handleChange} />
          <EditableField label="LOCATION" name="location" value={formData.location} isEditing={isEditing} onChange={handleChange} />
          <EditableField label="CURRENT ROLE" name="currentrole" value={formData.currentrole} isEditing={isEditing} onChange={handleChange} />
          <EditableField label="EXP (YEARS)" name="experience_years" value={formData.experience_years} isEditing={isEditing} onChange={handleChange} />
          <EditableField label="LINKEDIN" name="linkedin" value={formData.linkedin} isEditing={isEditing} onChange={handleChange} />
          <EditableField label="GITHUB" name="github" value={formData.github} isEditing={isEditing} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
}

// Helper for Editable Inputs
const EditableField = ({ label, name, value, isEditing, onChange }) => (
  <div style={styles.fieldGroup}>
    <label style={styles.label}>{label}</label>
    {isEditing ? (
      <input name={name} value={value || ""} onChange={onChange} style={styles.inputActive} />
    ) : (
      <div style={styles.inputStatic}>{value || "Not set"}</div>
    )}
  </div>
);

const styles = {
  pageContainer: { maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  title: { fontSize: "28px", fontWeight: "800" },
  card: { background: "#fff", padding: "30px", borderRadius: "20px", border: "1px solid #E2E8F0" },
  gridForm: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "11px", fontWeight: "700", color: "#64748B" },
  inputActive: { padding: "12px", borderRadius: "10px", border: "1px solid #0D9488", outline: "none" },
  inputStatic: { padding: "12px", borderRadius: "10px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC" },
  actionBtn: { display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "10px", border: "none", background: "#0D9488", color: "#fff", cursor: "pointer" },
  actionGroup: { 
    display: "flex", 
    flexDirection: "column", // Stacks buttons vertically
    gap: "10px" 
  },
  saveBtn: { 
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", 
    padding: "12px 20px", borderRadius: "10px", 
    border: "none", background: "#0D9488", // Teal/Green color
    color: "#fff", cursor: "pointer", fontWeight: "600" 
  },
  cancelBtn: { 
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", 
    padding: "12px 20px", borderRadius: "10px", 
    border: "none", background: "#64748B", // Gray/Blue color from your image
    color: "#fff", cursor: "pointer", fontWeight: "600" 
  }
};