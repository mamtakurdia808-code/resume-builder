import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiLogOut, FiLock, FiSave, FiEdit2, FiX, FiCalendar } from "react-icons/fi";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch real data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming you store token here
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          setUserData(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div style={styles.pageContainer}>Loading profile...</div>;
  if (!userData) return <div style={styles.pageContainer}>User not found.</div>;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.title}>Account Overview</h1>
      </div>

      <div style={styles.twoColumn}>
        <div style={styles.card}>
          <div style={styles.profileHeader}>
            <div style={styles.avatar}>{userData.full_name?.charAt(0).toUpperCase()}</div>
            <div>
              <h2 style={styles.userName}>{userData.full_name}</h2>
              <p style={styles.userEmail}>{userData.email}</p>
            </div>
          </div>

          <div style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>FULL NAME</label>
              <input disabled value={userData.full_name} style={styles.input} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>EMAIL ADDRESS</label>
              <input disabled value={userData.email} style={styles.input} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>ACCOUNT CREATED</label>
              <div style={styles.dateDisplay}>
                <FiCalendar /> {new Date(userData.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Account Settings</h3>
          <button style={styles.settingBtn}><FiLock /> Change Password</button>
          <button 
            onClick={() => { localStorage.removeItem("token"); window.location.reload(); }} 
            style={{...styles.settingBtn, color: "#EF4444"}}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: { maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" },
  header: { marginBottom: "30px" },
  title: { fontSize: "28px", fontWeight: "800", color: "#111827" },
  twoColumn: { display: "grid", gridTemplateColumns: "1fr 320px", gap: "30px" },
  card: { background: "#fff", padding: "30px", borderRadius: "20px", border: "1px solid #E2E8F0" },
  profileHeader: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px" },
  avatar: { width: "60px", height: "60px", background: "#0D9488", color: "#fff", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "700" },
  userName: { fontSize: "20px", margin: "0" },
  userEmail: { color: "#64748B", margin: "5px 0 0 0" },
  form: { display: "grid", gap: "20px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "11px", fontWeight: "700", color: "#64748B" },
  input: { padding: "12px", borderRadius: "10px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", color: "#111827" },
  dateDisplay: { padding: "12px", borderRadius: "10px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "10px", color: "#64748B" },
  cardTitle: { marginBottom: "20px" },
  settingBtn: { display: "flex", alignItems: "center", gap: "10px", padding: "15px 0", border: "none", background: "none", cursor: "pointer", fontWeight: "600", color: "#475569" }
};