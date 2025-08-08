document.getElementById('navbar').innerHTML = '<nav><a href="index.html">Home</a> | <a href="login.html">Login</a> | <a href="leaderboard.html">Leaderboard</a></nav>';
document.getElementById('footer').innerHTML = '<footer>© 2025 Fishademy. No fish were harmed.</footer>';

fetch('data/fake_leaderboard.json')
  .then(res => res.json())
  .then(data => {
    const topSwimmers = document.getElementById('topSwimmers');
    data.slice(0, 3).forEach(fish => {
      const li = document.createElement('li');
      li.textContent = `${fish.name} - Speed: ${fish.speed}`;
      topSwimmers.appendChild(li);
    });
  });