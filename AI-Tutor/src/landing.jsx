import { useNavigate } from "react-router-dom";
import "./landing.css";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <div className="overlay">
                <div className="content">
                    <h1 className="landing-title">Welcome to Cognito</h1>
                    <p className="landing-description">Tired of spending countless hours on lesson planning, grading, and creating engaging materials? Our app is your AI-powered teacher's assistant, designed to streamline your workflow and empower your teaching. Think of it as a smart tool that helps you generate quizzes, create custom worksheets, personalize learning experiences, and gain valuable insights into student understanding.</p>
                    <button className="get-started" onClick={() => navigate("/")}>Get Started</button>
                </div>
            </div>
        </div>
    );
}
