import "../assets/about.css"

export default function About() {
    return(
    <div class="about-container">
        <h1>About Us</h1>

        <p class="intro">
            We're a first-year squad from <strong>VIT Pune</strong>, building stuff that actually
            solves real problems instead of just sitting in a folder forever.
        </p>

        <h2>Meet the Team</h2>

        <div class="team-grid">

            <div class="team-card">
                <h3>Akul</h3>
                <p>Focused, curious, and always pushing us to level up.</p>
            </div>

            <div class="team-card">
                <h3>Ayush</h3>
                <p>The guy who brings clarity when the project goes off the rails.</p>
            </div>

            <div class="team-card">
                <h3>Varad</h3>
                <p>Direct, efficient, and makes sure the team keeps moving.</p>
            </div>

            <div class="team-card">
                <h3>Akshay</h3>
                <p>Quiet operator with big ideas and clean execution vibes.</p>
            </div>

        </div>

        <p class="closing">
            As first-year engineering students, we’re just getting started —  
            but trust, we’re building with ambition and long-term scalability in mind.
        </p>
    </div>

    )
}