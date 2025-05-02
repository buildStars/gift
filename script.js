document.addEventListener('DOMContentLoaded', () => {
    const showMessageBtn = document.getElementById('showMessage');
    const message = document.getElementById('hiddenMessage');
    const container = document.querySelector('.container');
    const petalContainer = document.querySelector('.petal-container');
    const typewriterText = document.getElementById('typewriter-text');
    const specialOptions = document.getElementById('special-options');
    const makeSnowBtn = document.getElementById('makeSnow');
    const specialEffectBtn = document.getElementById('specialEffect');
    const checkCubeBtn = document.getElementById('checkCube');
    const musicPlayer = document.getElementById('musicPlayer');
    const bgMusic = document.getElementById('bgMusic');
    const snowContainer = document.getElementById('snow-container');
    const photoCubeContainer = document.getElementById('photoCubeContainer');
    let photoCube = document.getElementById('photoCube');
    const closeSphere = document.getElementById('closeSphere');
    const photoDetail = document.getElementById('photoDetail');
    const detailImage = document.getElementById('detailImage');
    const photoCaption = document.getElementById('photoCaption');
    const backButton = document.getElementById('backButton');
    const cubeFaces = document.querySelectorAll('.cube-face');
    
    let isSnowing = false;
    let musicPlaying = false;
    let currentView = null;
    let isDetailView = false;
    let cubeAnimation = null;
    let audioLoaded = false;
    
    // 监听音频加载状态
    bgMusic.addEventListener('loadeddata', function() {
        console.log("音频文件已加载成功");
        audioLoaded = true;
    });
    
    bgMusic.addEventListener('error', function(e) {
        console.error("音频加载错误:", e);
        alert("背景音乐加载失败，请检查音频文件");
    });
    
    // 监听播放状态变化
    bgMusic.addEventListener('play', function() {
        console.log("音频开始播放");
        musicPlaying = true;
        musicPlayer.innerHTML = '<i class="fas fa-pause music-icon"></i>';
    });
    
    bgMusic.addEventListener('pause', function() {
        console.log("音频已暂停");
        musicPlaying = false;
        musicPlayer.innerHTML = '<i class="fas fa-music music-icon"></i>';
    });
    
    // 预加载音频
    try {
        bgMusic.load();
    } catch (e) {
        console.error("音频预加载失败:", e);
    }
    
    // 立方体照片URL数组 (小图) - **请替换成您女朋友的小照片URL**
    const cubePhotoUrls = [
        'images/1.jpg', 
        'images/2.jpg', 
        'images/3.jpg', 
        'images/4.jpg', 
        'images/5.jpg', 
        'images/6.jpg'  
    ];
    
    // 详情照片URL数组 (大图) - 使用相同的本地照片
    const detailPhotoUrls = [
        'images/1.jpg', 
        'images/2.jpg', 
        'images/3.jpg', 
        'images/4.jpg', 
        'images/5.jpg', 
        'images/6.jpg'  
    ];
    
    // 照片描述 - **请替换成您的描述**
    const photoCaptions = [
        '宝宝真好看',
        '宝宝真可爱',
        '宝宝真漂亮',
        '最爱宝宝了',
        '想和宝宝贴贴',
        '宝宝最美了'
    ];
    
    // 初始化设置立方体照片
    function setupCubeFaces() {
        cubeFaces.forEach((face, index) => {
            const img = face.querySelector('img');
            if (img) {
                img.src = cubePhotoUrls[index % cubePhotoUrls.length];
                img.alt = `照片${index + 1}`;
            }
            face.setAttribute('data-index', index);
        });
    }
    
    setupCubeFaces(); // 页面加载时设置立方体照片

    // 点击按钮直接显示照片立方体
    showMessageBtn.addEventListener('click', function() {
        // 隐藏当前视图
        hideCurrentView();
        
        // 显示照片立方体
        currentView = 'cube';
        photoCubeContainer.classList.add('active');
        closeSphere.style.display = 'flex';
        
        // 设置简单的立方体点击处理
        setupSimpleCubeClicks();
        
        // 添加鼠标控制旋转
        enableCubeMouseControl();
        
        // 显示特殊选项按钮
        // specialOptions.style.display = 'block';
        
        // 确保音乐播放，强制触发一次用户交互
        try {
            if (!musicPlaying && audioLoaded) {
                console.log("尝试播放音乐，加载状态:", audioLoaded);
                
                // 强制进行用户交互，解锁音频
                bgMusic.muted = true;
                bgMusic.play().then(() => {
                    bgMusic.muted = false;
                    bgMusic.currentTime = 0;
                    bgMusic.pause();
                    
                    // 再次尝试正常播放
                    setTimeout(() => {
                        bgMusic.muted = false;
                        bgMusic.play().then(() => {
                            console.log("用户交互后音频播放成功");
                        }).catch(err => {
                            console.error("二次播放失败:", err);
                            alert("请点击右下角音乐图标手动播放背景音乐");
                        });
                    }, 100);
                }).catch(err => {
                    console.error("初始解锁播放失败:", err);
                    bgMusic.muted = false;
                    alert("请点击右下角音乐图标手动播放背景音乐");
                });
            } else if (!audioLoaded) {
                console.warn("音频尚未加载完成，无法播放");
                alert("音频文件正在加载中，请稍候点击右下角图标播放背景音乐");
            }
        } catch (e) {
            console.error("音乐播放异常:", e);
        }
        
        // 创建爱心和烟花效果
        createHearts();
        setTimeout(createFireworks, 500);
        
        // 显示打字机效果
        setTimeout(() => {
            typewriterText.style.display = 'inline-block';
            typewriterText.style.width = '0';
            setTimeout(() => {
                typewriterText.style.width = '100%';
            }, 100);
        }, 800);
        
        // 更改按钮文本
        this.textContent = '💕 爱你哦 💕';
        
        // 保存立方体的动画
        if (!cubeAnimation) {
            cubeAnimation = window.getComputedStyle(photoCube).animation;
        }
    });

    // 简单的立方体点击处理设置
    function setupSimpleCubeClicks() {
        console.log("======= 重新设置立方体点击逻辑开始 =======");
        
        // 移除立方体上可能存在的旧点击事件处理程序
        const oldPhotoCube = photoCube;
        const newPhotoCube = oldPhotoCube.cloneNode(true);
        oldPhotoCube.parentNode.replaceChild(newPhotoCube, oldPhotoCube);
        photoCube = newPhotoCube;
        
        // 确保立方体开始时有动画效果
        if (cubeAnimation) {
            photoCube.style.animation = cubeAnimation;
            console.log("恢复已保存的动画:", cubeAnimation);
        } else {
            photoCube.style.animation = 'rotate 20s infinite linear';
            cubeAnimation = 'rotate 20s infinite linear'; // 保存初始动画
            console.log("设置初始动画: rotate 20s infinite linear");
        }
        
        // 重新获取所有立方体面
        const cubeFaces = document.querySelectorAll('.cube-face');
        console.log(`找到 ${cubeFaces.length} 个立方体面`);
        
        // 为立方体容器清除现有的点击事件处理程序
        photoCubeContainer.onclick = null; 
        
        // 直接为立方体的每个面添加点击事件
        cubeFaces.forEach((face, index) => {
            const newFace = face.cloneNode(true);
            face.parentNode.replaceChild(newFace, face);
            
            newFace.addEventListener('click', function(event) {
                console.log(`立方体面 ${index} 被点击！`);
                
                if (!isDetailView) {
                    console.log("处理点击事件: 停止动画并显示详情");
                    // 停止立方体旋转动画，保持当前角度
                    const currentTransform = window.getComputedStyle(photoCube).transform;
                    photoCube.style.animation = 'none';
                    photoCube.style.transform = currentTransform;
                    console.log("动画已停止，当前变换:", currentTransform);
                    
                    // 获取面的索引
                    const faceIndex = parseInt(this.getAttribute('data-index'));
                    console.log(`显示照片索引 ${faceIndex} 的详情`);
                    
                    // 设置对应的照片和描述
                    detailImage.src = detailPhotoUrls[faceIndex];
                    photoCaption.textContent = photoCaptions[faceIndex];
                    
                    // 显示详情
                    isDetailView = true;
                    photoDetail.classList.add('active');
                    
                    // 停止事件传播
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
        });
        
        console.log("======= 立方体点击设置完成 =======");
    }
    
    // 检查立方体按钮点击事件
    checkCubeBtn.addEventListener('click', () => {
        console.log("检查并重设立方体点击...");
        setupSimpleCubeClicks();
        alert("立方体点击已重新设置，请再次尝试点击");
    });
    
    // 启用照片立方体的鼠标控制
    function enableCubeMouseControl() {
        console.log("启用鼠标控制");
        let isDragging = false;
        let dragStarted = false; // 新增标志位，判断是否真正开始拖动
        let previousMousePosition = { x: 0, y: 0 };
        let rotation = { x: 0, y: 0 };
        // 获取初始旋转角度 (如果需要的话)
        // let initialRotation = ... extract from photoCube.style.transform or computed style
        
        photoCubeContainer.addEventListener('mousedown', (e) => {
            if (isDetailView) return; 
            isDragging = true;
            dragStarted = false; // 重置拖动状态
            previousMousePosition = { x: e.clientX, y: e.clientY };
            console.log("鼠标按下，准备拖动");
            // 不在这里停止动画，等待mousemove确认拖动
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging || isDetailView) return;
            
            // 第一次mousemove时停止动画
            if (!dragStarted) {
                console.log("鼠标移动，确认拖动，停止动画");
                photoCube.style.animation = 'none';
                // 可能需要在这里获取并应用当前变换，以防止跳动
                // const currentTransform = window.getComputedStyle(photoCube).transform;
                // photoCube.style.transform = currentTransform;
                // rotation = ... // 可能需要从 currentTransform 解析出当前旋转角度
                dragStarted = true;
            }
            
            const dx = e.clientX - previousMousePosition.x;
            const dy = e.clientY - previousMousePosition.y;
            
            // 累加旋转角度
            rotation.x += dy * 0.5;
            rotation.y += dx * 0.5;
            
            // 应用旋转
            photoCube.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
            
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                console.log("鼠标松开");
                isDragging = false;
                dragStarted = false; // 重置拖动状态
                // 可选：在这里可以添加惯性效果
            }
        });
        
        // 双击立方体恢复自动旋转
        photoCube.addEventListener('dblclick', (e) => {
            if (isDetailView) return; 
            console.log("双击恢复动画");
            if (cubeAnimation) {
                photoCube.style.animation = cubeAnimation;
                 // 重置手动旋转累积的角度
                 rotation = { x: 0, y: 0 };
            }
        });
        console.log("鼠标控制事件监听器已添加");
    }
    
    // 关闭按钮点击事件
    closeSphere.addEventListener('click', () => {
        if (isDetailView) {
            // 如果是详情视图，先关闭详情
            photoDetail.classList.remove('active');
            isDetailView = false;
            setTimeout(() => {
                hideCurrentView();
                closeSphere.style.display = 'none';
            }, 300);
        } else {
            hideCurrentView();
            closeSphere.style.display = 'none';
        }
    });
    
    // 隐藏当前视图
    function hideCurrentView() {
        if (currentView === 'cube') {
            photoCubeContainer.classList.remove('active');
        }
        
        if (isDetailView) {
            photoDetail.classList.remove('active');
            isDetailView = false;
        }
        
        currentView = null;
    }
    
    // 音乐播放器控制
    musicPlayer.addEventListener('click', () => {
        try {
            if (musicPlaying) {
                bgMusic.pause();
            } else {
                if (audioLoaded) {
                    bgMusic.play().catch(err => {
                        console.error("点击播放音乐失败:", err);
                        alert("音乐播放失败，请确保允许网页播放声音");
                    });
                } else {
                    alert("音频文件正在加载中，请稍候再试");
                    // 尝试再次加载
                    bgMusic.load();
                }
            }
        } catch (e) {
            console.error("音乐播放器点击处理异常:", e);
        }
    });

    // 浪漫飘雪效果
    makeSnowBtn.addEventListener('click', () => {
        if (!isSnowing) {
            startSnow();
            makeSnowBtn.textContent = '❄️ 停止飘雪';
        } else {
            stopSnow();
            makeSnowBtn.textContent = '❄️ 浪漫飘雪';
        }
        isSnowing = !isSnowing;
    });
    
    // 惊喜效果 - 气泡效果
    specialEffectBtn.addEventListener('click', () => {
        createBubbles();
        specialEffectBtn.textContent = '✨ 好漂亮!';
        setTimeout(() => {
            specialEffectBtn.textContent = '✨ 惊喜效果';
        }, 3000);
    });

    // 生成花瓣动画
    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = (Math.random() * 5 + 5) + 's';
        petal.style.backgroundColor = `rgba(255,${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},0.8)`;
        petal.style.transform = `rotate(${Math.random() * 360}deg)`;
        petalContainer.appendChild(petal);

        setTimeout(() => petal.remove(), 10000);
    }

    // 生成爱心动画
    function createHearts() {
        for (let i = 0; i < 10; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = Math.random() * 100 + 'vh';
            heart.style.animationDelay = Math.random() * 2 + 's';
            petalContainer.appendChild(heart);

            setTimeout(() => heart.remove(), 5000);
        }
    }

    // 生成烟花效果
    function createFireworks() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.classList.add('firework');
                firework.style.left = Math.random() * 100 + 'vw';
                firework.style.top = Math.random() * 100 + 'vh';
                petalContainer.appendChild(firework);

                setTimeout(() => firework.remove(), 2000);
            }, i * 300);
        }
    }
    
    // 雪花效果
    function startSnow() {
        for (let i = 0; i < 50; i++) {
            createSnowflake();
        }
        
        snowInterval = setInterval(() => {
            createSnowflake();
        }, 200);
    }
    
    function stopSnow() {
        clearInterval(snowInterval);
        snowContainer.innerHTML = '';
    }
    
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.opacity = Math.random() * 0.8 + 0.2;
        snowflake.style.width = snowflake.style.height = Math.random() * 10 + 5 + 'px';
        snowflake.style.animationDuration = Math.random() * 5 + 10 + 's';
        snowContainer.appendChild(snowflake);
        
        setTimeout(() => snowflake.remove(), 15000);
    }
    
    // 气泡效果
    function createBubbles() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const bubble = document.createElement('div');
                bubble.classList.add('bubble');
                bubble.style.left = Math.random() * 100 + 'vw';
                bubble.style.width = bubble.style.height = Math.random() * 30 + 20 + 'px';
                bubble.style.animationDuration = Math.random() * 6 + 6 + 's';
                bubble.style.animationDelay = Math.random() * 2 + 's';
                petalContainer.appendChild(bubble);
                
                setTimeout(() => bubble.remove(), 10000);
            }, i * 150);
        }
    }
    
    // 点击页面任意位置产生爱心
    document.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON' && !e.target.closest('.music-player') && !e.target.closest('.back-button') && !e.target.closest('.photo-cube-container')) {
            createFloatingHeart(e.clientX, e.clientY);
        }
    });
    
    // 创建点击浮动爱心
    function createFloatingHeart(x, y) {
        const heart = document.createElement('div');
        heart.classList.add('heart', 'floating-heart');
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.setProperty('--tx', (Math.random() * 100 - 50) + 'px');
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 2000);
    }

    // 添加鼠标移动效果
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        container.style.transform = `perspective(1000px) rotateX(${(y - 0.5) * 10}deg) rotateY(${(x - 0.5) * 10}deg)`;
    });

    // 定期生成花瓣
    setInterval(createPetal, 300);

    // 返回按钮点击事件处理
    backButton.addEventListener('click', function() {
        console.log("返回按钮被点击");
        
        // 隐藏详情面板
        photoDetail.classList.remove('active');
        
        // 设置不在详情视图
        isDetailView = false;
        
        // 恢复立方体旋转
        setTimeout(() => {
            if (currentView === 'cube') {
                console.log("恢复立方体动画");
                if (cubeAnimation) {
                    photoCube.style.animation = cubeAnimation;
                    // 重置手动旋转累积的角度
                    rotation = { x: 0, y: 0 };
                    // 可能需要重置 transform 以匹配动画初始状态，但这取决于动画如何定义
                    // photoCube.style.transform = ''; 
                }
            }
        }, 300); // 延迟以匹配过渡效果
    });
});
// 添加背景动效
function createBgAnimations() {
    const bgContainer = document.getElementById('bgAnimationContainer');
    
    // 创建背景雪花
    function createBgSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('bg-snowflake');
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.opacity = Math.random() * 0.6 + 0.2;
        snowflake.style.width = snowflake.style.height = Math.random() * 8 + 5 + 'px';
        snowflake.style.animationDuration = Math.random() * 10 + 15 + 's';
        bgContainer.appendChild(snowflake);
        
        setTimeout(() => snowflake.remove(), 25000);
    }
    
    // 创建背景爱心
    function createBgHeart() {
        const heart = document.createElement('div');
        heart.classList.add('bg-heart');
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 6 + 's';
        bgContainer.appendChild(heart);
        
        setTimeout(() => heart.remove(), 9000);
    }
    
    // 创建背景花瓣
    function createBgPetal() {
        const petal = document.createElement('div');
        petal.classList.add('bg-petal');
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = Math.random() * 8 + 10 + 's';
        bgContainer.appendChild(petal);
        
        setTimeout(() => petal.remove(), 18000);
    }
    
    // 初始化创建一些元素
    for(let i = 0; i < 15; i++) {
        setTimeout(() => {
            createBgSnowflake();
            if(i % 3 === 0) createBgHeart();
            if(i % 2 === 0) createBgPetal();
        }, i * 300);
    }
    
    // 定期创建新元素
    setInterval(createBgSnowflake, 1000);
    setInterval(createBgHeart, 2000);
    setInterval(createBgPetal, 1500);
}

// 启动背景动效
createBgAnimations();