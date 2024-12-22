
        const clientId = '1219522587634302976';
        const clientSecret = 'pZ6G7uYggAf5nGMg-32gNC0SG3HnhA0_';
        const redirectUri = 'https://ntgamesdev.github.io/ntsutdio/';
        const authEndpoint = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=identify+email`;
    
        async function loginWithDiscord() {
            window.location.href = authEndpoint;
        }
    
        async function fetchAccessToken(code) {
            const response = await fetch('https://discord.com/api/oauth2/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: redirectUri
                })
            });
            return response.json();
        }
    
        async function fetchUserProfile(token) {
            const response = await fetch('https://discord.com/api/users/@me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.json();
        }
    
        function saveUserToLocalStorage(user, points) {
            const currentDate = new Date();
            const loginDate = currentDate.toLocaleString();
            const month = currentDate.toLocaleString('default', { month: 'long' });
            const userData = {
                username: user.username,
                userId: user.id,
                avatar: user.avatar,
                points: points,
                loginDate: loginDate,
                month: month
            };
            localStorage.setItem('user', JSON.stringify(userData));
        }
    
        function logout() {
            Swal.fire({
                icon: 'success',
                title: 'ออกจากระบบสำเร็จ!',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                localStorage.removeItem('user');
                sessionStorage.clear();
    
                window.location.href = redirectUri;
            });
        }
    
        async function displayUserProfile(user) {
            try {
                const points = await fetchUserPoints(user.id);
                saveUserToLocalStorage(user, points);
                Swal.fire({
                    icon: 'success',
                    title: 'เข้าสู่ระบบสำเร็จ!',
                    timer: 2000,
                    showConfirmButton: false
                });
                document.getElementById('login-area').innerHTML = `
                    <button class="btn btn-outline-danger logout-btn" onclick="logout()">ออกจากระบบ</button>
                `;
                document.getElementById('user-info').innerHTML = `
                    <div class="d-flex align-items-center">
                        <img src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png" 
                             alt="${user.username}" class="rounded-circle me-3" 
                             style="width: 50px; height: 50px;">
                        <div>
                            <div class="fw-bold">${user.username}</div>
                            <div class="user-points">Point: ${points}</div>
                            <div>เข้าสู่ระบบเมื่อ: ${new Date().toLocaleDateString()} (${user.month})</div>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error('Error displaying user profile or fetching points:', error);
                showLoginButton();
            }
        }
    
        function showLoginButton() {
            document.getElementById('user-info').innerHTML = `
                <div class="text-center">
                    <div class="summary-label mb-2">คุณยังไม่เป็นส่วนหนึ่งกับเรา</div>
                    <button class="btn btn-outline-primary mt-2 d-flex align-items-center login-btn" onclick="loginWithDiscord()">
                        <img src="https://cdn.iconscout.com/icon/free/png-256/discord-3-569463.png" alt="Discord Icon">
                        เข้าสู่ระบบด้วย Discord
                    </button>
                </div>
            `;
        }
    
        async function handleRedirect() {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
    
            if (localStorage.getItem('user')) {
                const user = JSON.parse(localStorage.getItem('user'));
                displayUserProfile(user);
            } else if (code) {
                try {
                    const tokenData = await fetchAccessToken(code);
                    const user = await fetchUserProfile(tokenData.access_token);
                    displayUserProfile(user);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    showLoginButton();
                }
            } else {
                showLoginButton();
            }
        }
    
        document.addEventListener('DOMContentLoaded', handleRedirect);
    
        async function fetchUserPoints(userId) {
            return Math.floor(Math.random() * 100); // ตัวอย่าง, ใช้ logic จริงแทน
        }
        const apiUrl = "https://ntgamesdev.github.io/ntsutdio/";