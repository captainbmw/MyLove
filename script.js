document.addEventListener('DOMContentLoaded', () => {
    const background = document.getElementById('background');
    const submitBtn = document.getElementById('submit-btn');
    const answerInput = document.getElementById('answer-input');
    const proposalCard = document.getElementById('proposal-card');
    const celebration = document.getElementById('celebration');

    // Create expanding cinematic hearts
    function createExpandingHeart() {
        const heart = document.createElement('div');
        heart.classList.add('expanding-heart');
        heart.innerHTML = '❤️';
        
        // Very slight offset to keep it centered enough to frame content
        const offsetX = (Math.random() - 0.5) * 5;
        const offsetY = (Math.random() - 0.5) * 5;
        heart.style.marginLeft = `${offsetX}px`;
        heart.style.marginTop = `${offsetY}px`;
        
        background.appendChild(heart);

        // Cleanup
        setTimeout(() => {
            heart.remove();
        }, 10000);
    }

    // Generate cinematic hearts periodically (slower for focus)
    setInterval(createExpandingHeart, 3000);

    // Initial heart
    createExpandingHeart();

    // Submit Action & WhatsApp Integration
    submitBtn.addEventListener('click', () => {
        const answer = answerInput.value.trim();
        
        if (answer === "") {
            answerInput.style.borderColor = "#ff4d6d";
            setTimeout(() => answerInput.style.borderColor = "rgba(255,255,255,0.1)", 2000);
            return;
        }

        // WhatsApp Integration
        const phoneNumber = "254796092703";
        const message = `From my heart: "${answer}"`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');

        // Cinematic Transition
        proposalCard.style.opacity = '0';
        proposalCard.style.transform = 'translateY(20px) scale(0.95)';
        
        setTimeout(() => {
            proposalCard.classList.add('hidden');
            celebration.classList.remove('hidden');
            
            // Celebration burst of hearts
            for(let i = 0; i < 20; i++) {
                setTimeout(createExpandingHeart, i * 200);
            }
        }, 800);
    });
});
