document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;

            const increment = target / 200;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 20); // Adjust this value to control speed
            } else {
                counter.innerText = target.toLocaleString(); // Ensures the final number is displayed correctly
            }
        };

        updateCount();
    });
});
