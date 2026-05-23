document.addEventListener('DOMContentLoaded', () => {
    const background = document.getElementById('background');
    const submitBtn = document.getElementById('submit-btn');
    const answerInput = document.getElementById('answer-input');
    const proposalCard = document.getElementById('proposal-card');
    const celebration = document.getElementById('celebration');

    // Create falling hearts (Professional Background)
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 5 + 3 + 's'; // Slower, more emotional (3-8s)
        heart.style.fontSize = Math.random() * 15 + 10 + 'px';
        heart.style.opacity = Math.random() * 0.5 + 0.2;
        
        background.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 8000);
    }

    // Generate hearts periodically
    setInterval(createHeart, 400);

    // Submit Action & WhatsApp Integration
    submitBtn.addEventListener('click', () => {
        const answer = answerInput.value.trim();
        
        if (answer === "") {
            answerInput.style.borderColor = "#ff4757";
            setTimeout(() => answerInput.style.borderColor = "#dcdde1", 2000);
            return;
        }

        // WhatsApp Integration
        const phoneNumber = "254796092703"; // Your WhatsApp number
        const message = `My answer to your question: "${answer}"`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');

        // Show on-screen celebration
        proposalCard.style.opacity = '0';
        setTimeout(() => {
            proposalCard.classList.add('hidden');
            celebration.classList.remove('hidden');
            
            // Burst of emotional hearts
            for(let i = 0; i < 40; i++) {
                setTimeout(createHeart, i * 150);
            }
        }, 600);
    });
});
