const input = document.getElementById("input");
const send = document.getElementById("send");
const messages = document.getElementById("messages");
const status = document.getElementById("status");


// ========================================
// 設定
// ========================================

// 書類に印刷する正解マーカーID
const CORRECT_MARKER_ID = 23;


// ========================================
// 効果音
// ========================================

const messageSound =
    new Audio("sounds/message.mp3");

const ghostSound =
    new Audio("sounds/ghost.mp3");


// 通知音
messageSound.volume = 0.8;


// お化け音
ghostSound.volume = 1.0;


// ========================================
// 通知音
// ========================================

function playMessageSound() {

    messageSound.currentTime = 0;

    messageSound.play().catch(() => {});

}


// ========================================
// お化け音
// ========================================

function playGhostSound() {

    ghostSound.currentTime = 0;

    ghostSound.play().catch(() => {});

}


// ========================================
// スマホ振動
// ========================================

function vibrate(pattern) {

    // Vibration API対応端末だけ
    if (
        "vibrate" in navigator
    ) {

        navigator.vibrate(pattern);

    }

}


// ========================================
// メッセージ追加
// ========================================

function addMessage(text, type) {

    const message =
        document.createElement("div");

    message.classList.add("message");

    message.classList.add(type);

    message.textContent = text;

    messages.appendChild(message);

    messages.scrollTop =
        messages.scrollHeight;


    // システムメッセージ
    if (type === "system") {

        playMessageSound();

    }

}


// ========================================
// 赤文字メッセージ
// ========================================

function addRedMessage(text) {

    const message =
        document.createElement("div");

    message.classList.add(
        "message",
        "system"
    );

    message.textContent = text;

    message.style.color = "#ff3333";

    message.style.fontWeight = "bold";

    messages.appendChild(message);

    messages.scrollTop =
        messages.scrollHeight;

    playMessageSound();

}


// ========================================
// 画像追加
// ========================================

function addImage(src, type) {

    const message =
        document.createElement("div");

    message.classList.add(
        "message",
        type
    );


    const image =
        document.createElement("img");

    image.src = src;

    image.style.maxWidth = "100%";

    image.style.borderRadius = "8px";

    image.style.display = "block";


    message.appendChild(image);

    messages.appendChild(message);

    messages.scrollTop =
        messages.scrollHeight;

}


// ========================================
// URLメッセージ
// ========================================

function addLinkMessage(text, url) {

    const message =
        document.createElement("div");

    message.classList.add(
        "message",
        "system"
    );


    const textElement =
        document.createElement("div");

    textElement.textContent = text;


    const link =
        document.createElement("a");

    link.href = url;

    link.textContent = url;

    link.target = "_blank";

    link.rel =
        "noopener noreferrer";


    link.style.color =
        "#4da6ff";

    link.style.textDecoration =
        "underline";

    link.style.display =
        "block";

    link.style.marginTop =
        "6px";


    message.appendChild(
        textElement
    );

    message.appendChild(
        link
    );

    messages.appendChild(
        message
    );

    messages.scrollTop =
        messages.scrollHeight;


    playMessageSound();

}


// ========================================
// 画面揺れ開始
// ========================================

function shakeScreen() {

    const chat =
        document.querySelector(".chat");

    if (!chat) {
        return;
    }

    chat.classList.add(
        "horror-shake"
    );

}


// ========================================
// 画面揺れ停止
// ========================================

function stopShakeScreen() {

    const chat =
        document.querySelector(".chat");

    if (!chat) {
        return;
    }

    chat.classList.remove(
        "horror-shake"
    );

}


// ========================================
// 一瞬暗転
// ========================================

function blackoutScreen() {

    const blackout =
        document.createElement("div");

    blackout.classList.add(
        "blackout"
    );

    document.body.appendChild(
        blackout
    );


    setTimeout(() => {

        blackout.remove();

    }, 300);

}


// ========================================
// ミツケタ画面
// ========================================

function showFoundMessage(letter) {

    let screen =
        document.getElementById(
            "foundScreen"
        );


    if (!screen) {

        screen =
            document.createElement("div");

        screen.id =
            "foundScreen";

        screen.classList.add(
            "found-screen"
        );

        document.body.appendChild(
            screen
        );

    }


    screen.innerHTML = "";


    const letterElement =
        document.createElement("div");

    letterElement.classList.add(
        "found-letter"
    );

    letterElement.textContent =
        letter;


    screen.appendChild(
        letterElement
    );

}


// ========================================
// ミツケタ画面を消す
// ========================================

function hideFoundScreen() {

    const screen =
        document.getElementById(
            "foundScreen"
        );

    if (screen) {

        screen.remove();

    }

}


// ========================================
// ArUcoマーカー判定
// ========================================

function checkMarker(file) {

    return new Promise((resolve) => {

        const image =
            new Image();

        const url =
            URL.createObjectURL(file);


        image.onload =
            function() {

                try {

                    const canvas =
                        document.createElement(
                            "canvas"
                        );


                    const context =
                        canvas.getContext(
                            "2d",
                            {
                                willReadFrequently: true
                            }
                        );


                    // 写真を縮小
                    const maxSize = 800;


                    let width =
                        image.naturalWidth;

                    let height =
                        image.naturalHeight;


                    if (
                        width > maxSize ||
                        height > maxSize
                    ) {

                        const ratio =
                            Math.min(
                                maxSize / width,
                                maxSize / height
                            );


                        width =
                            Math.round(
                                width * ratio
                            );


                        height =
                            Math.round(
                                height * ratio
                            );

                    }


                    canvas.width =
                        width;

                    canvas.height =
                        height;


                    context.drawImage(
                        image,
                        0,
                        0,
                        width,
                        height
                    );


                    const imageData =
                        context.getImageData(
                            0,
                            0,
                            width,
                            height
                        );


                    const detector =
                        new AR.Detector({
                            dictionaryName:
                                "ARUCO"
                        });


                    const markers =
                        detector.detect(
                            imageData
                        );


                    console.log(
                        "検出されたマーカー:",
                        markers
                    );


                    const found =
                        markers.some(
                            marker =>
                                marker.id ===
                                CORRECT_MARKER_ID
                        );


                    URL.revokeObjectURL(
                        url
                    );


                    resolve(found);

                }

                catch (error) {

                    console.error(
                        "マーカー検出エラー:",
                        error
                    );


                    URL.revokeObjectURL(
                        url
                    );


                    resolve(false);

                }

            };


        image.onerror =
            function() {

                URL.revokeObjectURL(
                    url
                );

                resolve(false);

            };


        image.src = url;

    });

}


// ========================================
// 写真送信ボタン
// ========================================

function showPhotoButton() {

    if (
        document.getElementById(
            "photoButton"
        )
    ) {

        return;

    }


    const button =
        document.createElement(
            "button"
        );


    button.id =
        "photoButton";


    button.textContent =
        "📷 写真を送る";


    button.style.display =
        "block";

    button.style.margin =
        "10px auto";

    button.style.padding =
        "12px 20px";

    button.style.border =
        "none";

    button.style.borderRadius =
        "10px";

    button.style.background =
        "#444";

    button.style.color =
        "white";

    button.style.fontSize =
        "16px";


    const fileInput =
        document.createElement(
            "input"
        );


    fileInput.type =
        "file";

    fileInput.accept =
        "image/*";

    fileInput.capture =
        "environment";

    fileInput.style.display =
        "none";


    // ====================================
    // 写真ボタン
    // ====================================

    button.addEventListener(
        "click",
        function() {

            fileInput.click();

        }
    );


    // ====================================
    // 写真選択
    // ====================================

    fileInput.addEventListener(
        "change",
        async function() {

            const file =
                fileInput.files[0];


            if (!file) {
                return;
            }


            // =================================
            // 写真を表示
            // =================================

            const imageURL =
                URL.createObjectURL(
                    file
                );


            addImage(
                imageURL,
                "user"
            );


            button.remove();

            fileInput.remove();


            // =================================
            // 確認中
            // =================================

            addMessage(
                "画像を確認している……",
                "system"
            );


            // 人間が確認している感じ
            await new Promise(
                resolve => {
                    setTimeout(
                        resolve,
                        3000
                    );
                }
            );


            // =================================
            // マーカー判定
            // =================================

            const isCorrect =
                await checkMarker(
                    file
                );


            // =================================
            // 不正解
            // =================================

            if (!isCorrect) {

                addMessage(
                    "……違う。",
                    "system"
                );


                setTimeout(() => {

                    addMessage(
                        "もう一度探せ。",
                        "system"
                    );


                    showPhotoButton();

                }, 1500);


                return;
            }


            // =================================
            // 正解
            // =================================

            addMessage(
                "画像を確認した。\n"
                + "その部屋にしばらく留まっておけ。",
                "system"
            );


            // =================================
            // 5秒後
            // ホラー開始
            // =================================

            setTimeout(() => {


                // OFFLINE
                status.textContent =
                    "● OFFLINE";


                // 画面揺れ
                shakeScreen();


                // スマホ振動開始
                vibrate([
                    150,
                    80,
                    120,
                    80,
                    180,
                    120,
                    80
                ]);


                // 一瞬暗転
                blackoutScreen();


                // =================================
                // 文字化け
                // =================================

                addMessage(
                    "縺薙�縺ｮ縺ｧ……",
                    "system"
                );


                setTimeout(() => {

                    addMessage(
                        "繧医￥縺ｿ縺ｨ縺ｦ……",
                        "system"
                    );

                }, 1000);


                setTimeout(() => {

                    addMessage(
                        "縺薙�縺ｦ縺ｿ縺ｾ縺吶�",
                        "system"
                    );

                }, 1800);


                setTimeout(() => {

                    addMessage(
                        "縺ゅ�縺�",
                        "system"
                    );

                }, 2400);


                setTimeout(() => {

                    addMessage(
                        "縺ｿ縺､縺代◆",
                        "system"
                    );

                }, 2800);


                // 0.4秒
                setTimeout(() => {

                    addMessage(
                        "縺ｪ縺ｾ縺ｨ縺九￥",
                        "system"
                    );

                }, 3200);


                // 0.4秒
                setTimeout(() => {

                    addMessage(
                        "繧ゅ≧縺ｿ縺ｦ",
                        "system"
                    );

                }, 3600);


                // 0.4秒
                setTimeout(() => {

                    addMessage(
                        "縺ｿ縺､縺代◆",
                        "system"
                    );

                }, 4000);


                // =================================
                // ミ
                // =================================

                setTimeout(() => {

                    showFoundMessage(
                        "ミ"
                    );

                }, 5000);


                // =================================
                // ツ
                // =================================

                setTimeout(() => {

                    showFoundMessage(
                        "ツ"
                    );

                }, 6000);


                // =================================
                // ケ
                // =================================

                setTimeout(() => {

                    showFoundMessage(
                        "ケ"
                    );

                }, 7000);


                // =================================
                // タ
                // =================================

                setTimeout(() => {

                    showFoundMessage(
                        "タ"
                    );


                    // タの瞬間に画面揺れ停止
                    stopShakeScreen();


                    // タの瞬間に短い振動
                    vibrate([
                        250,
                        100,
                        350
                    ]);

                }, 8000);


                // =================================
                // タの1秒後
                // お化け音
                // =================================

                setTimeout(() => {

                    playGhostSound();

                }, 9000);


                // =================================
                // タから10秒後
                // チャット復帰
                // =================================

                setTimeout(() => {


                    hideFoundScreen();


                    status.textContent =
                        "● ONLINE";


                    addMessage(
                        "再接続できたようだ。",
                        "system"
                    );

                }, 18000);


                // =================================
                // その後
                // =================================

                setTimeout(() => {

                    addMessage(
                        "協力に感謝する。",
                        "system"
                    );

                }, 20000);


                setTimeout(() => {

                    addMessage(
                        "ただ家主に見つかってしまったようだな。館内にある4桁の数字を探して脱出するんだ。さっき送った間取り図を参考にしろ。",
                        "system"
                    );

                }, 22000);

                setTimeout(() => {

                    addImage(
                        "images/room_map.png",
                        "system"
                    );

                }, 23000);

                // 生きて帰れたら
                setTimeout(() => {

                    const message =
                        document.createElement(
                            "div"
                        );


                    message.classList.add(
                        "message",
                        "system"
                    );


                    message.innerHTML =
                        "<strong style='color:#ff3333;'>"
                        + "5分以内に生きて帰れたら"
                        + "</strong>"
                        + "報酬を渡そう。";


                    messages.appendChild(
                        message
                    );


                    messages.scrollTop =
                        messages.scrollHeight;


                    playMessageSound();

                }, 24000);


                // =================================
                // 接続切断
                // =================================

                setTimeout(() => {

                    const message =
                        document.createElement(
                            "div"
                        );


                    message.classList.add(
                        "message",
                        "system",
                        "disconnect-message"
                    );


                    message.textContent =
                        "――匿名さんの接続が切れました――";


                    message.style.marginTop =
                        "80px";

                    message.style.marginBottom =
                        "80px";


                    message.style.textAlign =
                        "center";


                    messages.appendChild(
                        message
                    );


                    messages.scrollTop =
                        messages.scrollHeight;


                    playMessageSound();

                }, 26000);

            }, 5000);

        }
    );


    messages.appendChild(
        button
    );


    messages.scrollTop =
        messages.scrollHeight;

}


// ========================================
// 入室処理
// ========================================

function enteredRoom() {


    // 1秒後
    setTimeout(() => {

        addMessage(
            "館の間取り図だ。",
            "system"
        );

    }, 1000);


    // 3秒後
    setTimeout(() => {

        addImage(
            "images/full_map.png",
            "system"
        );

    }, 3000);


    // 5秒後
    setTimeout(() => {

        addMessage(
            "書斎の机の上にある日記全体の写真を送れ。",
            "system"
        );


        showPhotoButton();

    }, 5000);

}


// ========================================
// メッセージ送信
// ========================================

function sendMessage() {

    const text =
        input.value.trim();


    if (text === "") {
        return;
    }


    // 客のメッセージ
    addMessage(
        text,
        "user"
    );


    input.value = "";


    // ====================================
    // 入室前確認
    // ====================================

    const normalizedText =
        text
            .replace(/\s/g, "")
            .toLowerCase();


    // ====================================
    // 「はい」
    // ====================================

    if (
        normalizedText.includes("はい")
    ) {


        // 最初の質問
        if (
            !window.noticeCheckStarted
        ) {

            window.noticeCheckStarted =
                true;


            setTimeout(() => {

                addMessage(
                    "通知音はなりましたか？",
                    "system"
                );

            }, 1000);


            return;
        }


        // 通知確認後
        if (
            !window.noticeCheckFinished
        ) {

            window.noticeCheckFinished =
                true;


            setTimeout(() => {

                addMessage(
                    "館に入ったら「入った」と送れ。",
                    "system"
                );

            }, 1000);


            return;
        }

    }


    // ====================================
    // 「入」「はい」を含む
    // ====================================

    // 確認が終わってから入室判定
    if (
        window.noticeCheckFinished &&
        (
            normalizedText.includes("入") ||
            normalizedText.includes("はい")
        )
    ) {

        if (
            !window.enteredStarted
        ) {

            window.enteredStarted =
                true;

            enteredRoom();

        }

    }


    // ====================================
    // 脱出成功
    // ====================================

    if (
        text === "脱出成功"
    ) {


        // =================================
        // 1秒
        // =================================

        setTimeout(() => {

            addMessage(
                "脱出おめでとう！",
                "system"
            );

        }, 1000);


        // =================================
        // 3秒
        // 全体図
        // =================================

        setTimeout(() => {

            addImage(
                "images/full_map.png",
                "system"
            );

        }, 3000);


        // =================================
        // 5秒
        // =================================

        setTimeout(() => {

            addMessage(
                "無事に脱出したようだな。",
                "system"
            );

        }, 5000);


        // =================================
        // 7秒
        // =================================

        setTimeout(() => {

            addMessage(
                "クラ発投票お願いします！",
                "system"
            );

        }, 7000);


        // =================================
        // 8秒
        // 投票URL
        // =================================

        setTimeout(() => {

            addLinkMessage(
                "クラブ発表の投票はこちら",
                "https://example.com"
            );

        }, 8000);


        // =================================
        // 8.5秒
        // 少し揺らす
        // =================================

        setTimeout(() => {

            shakeScreen();

        }, 8500);


        // =================================
        // 9秒
        // =================================

        setTimeout(() => {

            stopShakeScreen();

            addRedMessage(
                "友達になれたね"
            );

        }, 9000);

    }

}


// ========================================
// 送信ボタン
// ========================================

send.addEventListener(
    "click",
    sendMessage
);


// ========================================
// Enterキー
// ========================================

input.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            sendMessage();

        }

    }
);


// ========================================
// 最初のメッセージ
// ========================================

setTimeout(() => {

    addMessage(
        "このメッセージは見えていますか？",
        "system"
    );

}, 500);