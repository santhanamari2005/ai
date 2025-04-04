const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const careerData = {
    "Computer Science": {
        courses: [
            { name: "BSc Computer Science", cutoff: "60-95%" },
            { name: "BCA (Bachelor of Computer Applications)", cutoff: "55-90%" },
            { name: "BTech CSE", cutoff: "70-99%" },
            { name: "BSc Artificial Intelligence & Data Science", cutoff: "70-95%" },
            { name: "BSc Cyber Security", cutoff: "65-92%" }
        ],
        careers: ["Software Developer", "Data Scientist", "AI Engineer", "Cyber Security Analyst", "Game Developer"]
    },
    "Biology": {
        courses: [
            { name: "MBBS", cutoff: "85-99% (NEET-Based)" },
            { name: "BDS", cutoff: "75-95% (NEET-Based)" },
            { name: "BSc Nursing", cutoff: "55-85%" },
            { name: "BPharm", cutoff: "60-90%" },
            { name: "BSc Biotechnology", cutoff: "65-92%" }
        ],
        careers: ["Doctor", "Pharmacist", "Nurse", "Veterinary Doctor", "Biotechnologist"]
    },
    "Commerce": {
        courses: [
            { name: "BCom General", cutoff: "50-85%" },
            { name: "BCom Accounting & Finance", cutoff: "55-90%" },
            { name: "BBA (Bachelor of Business Administration)", cutoff: "55-92%" },
            { name: "BCom Banking & Insurance", cutoff: "60-94%" }
        ],
        careers: ["Accountant", "Investment Banker", "Financial Analyst", "Tax Consultant", "Entrepreneur"]
    },
    "Arts": {
        courses: [
            { name: "BA English", cutoff: "50-85%" },
            { name: "BA Journalism", cutoff: "55-90%" },
            { name: "BFA (Fine Arts)", cutoff: "60-95%" },
            { name: "BA Political Science", cutoff: "50-90%" }
        ],
        careers: ["Graphic Designer", "Animator", "Writer", "Fashion Designer", "Film Director"]
    }
};

app.get("/careers/:group", (req, res) => {
    const group = req.params.group;
    if (careerData[group]) {
        res.json(careerData[group]);
    } else {
        res.status(404).json({ message: "Group not found" });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



