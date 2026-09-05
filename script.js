const input = document.getElementById("input");
const send = document.getElementById("send");
const messages = document.getElementById("messages");
const status = document.getElementById("status");


// ========================================
// 状態管理
// ========================================

// 初期状態
// 0 = 最初の質問
// 1 = 「館に入ったら...」待ち
// 2 = 入室後
// 3 = 暗号①
// 4 = 暗号②
// 5 = 暗号③
// 6 = ④の場所まで到達、脱出待ち
// 7 = 脱出成功後
let gameStep = 0;


// ========================================
// 効果音
// ========================================

const messageSound =
    new Audio("sounds/message.mp3");

const ghostSound =
    new Audio("sounds/ghost.mp3");

messageSound.volume = 0.8;
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

    if ("vibrate" in navigator) {

        navigator.vibrate(pattern);

    }

}


// ========================================
// メッセージ追加
// ========================================

function addMessage(text, type) {

    const message =
        document.createElement("div");

    message.classList.add(
        "message",
        type
    );

    message.textContent = text;

    messages.appendChild(message);

    messages.scrollTop =
        messages.scrollHeight;


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


    link.style.color = "#4da6ff";

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
// 画面揺れ
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
            document.createElement(
                "div"
            );

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
        document.createElement(
            "div"
        );

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


            // 3秒待つ
            await new Promise(
                resolve => {

                    setTimeout(
                        resolve,
                        3000
                    );

                }
            );


            // =================================
            // 写真は何でもOK
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


                // スマホ振動
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
                // 文字化け開始
                // =================================

                addMessage(
                    "縺薙�縺ｮ縺ｧ……",
                    "system"
                );


                // 1秒
                setTimeout(() => {

                    addMessage(
                        "繧医￥縺ｿ縺ｨ縺ｦ……",
                        "system"
                    );

                }, 1000);


                // 0.8秒
                setTimeout(() => {

                    addMessage(
                        "縺薙�縺ｦ縺ｿ縺ｾ縺吶�",
                        "system"
                    );

                }, 1800);


                // 0.6秒
                setTimeout(() => {

                    addMessage(
                        "縺ゅ�縺�",
                        "system"
                    );

                }, 2400);


                // 0.4秒
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

                    showFoundMessage("ミ");

                }, 5000);


                // =================================
                // ツ
                // =================================

                setTimeout(() => {

                    showFoundMessage("ツ");

                }, 6000);


                // =================================
                // ケ
                // =================================

                setTimeout(() => {

                    showFoundMessage("ケ");

                }, 7000);


                // =================================
                // タ
                // =================================

                setTimeout(() => {

                    showFoundMessage("タ");


                    // 揺れ停止
                    stopShakeScreen();


                    // 「タ」で強めの振動
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
                // チャットに戻る
                // =================================

                setTimeout(() => {


                    hideFoundScreen();

                    const spacer = document.createElement("div");

                    spacer.style.height = "1.5em";

                    messages.appendChild(spacer);

                    status.textContent =
                        "● ONLINE";


                    addMessage(
                        "再接続できたようだ。",
                        "system"
                    );


                    // 暗号①へ
                    gameStep = 3;


                    setTimeout(() => {

                        addMessage(
                            "この館から出るには4桁のコードが必要だ。",
                            "system"
                        );

                    }, 2000);


                    setTimeout(() => {

                        addMessage(
                            "まず暖炉の付近にある①の数字を探し、"
                            + "見つけた数字を送ってくれ。",
                            "system"
                        );

                    }, 4000);


                    setTimeout(() => {

                        addImage(
                            "images/room2_map.png",
                            "system"
                        );

                    }, 6000);


                }, 18000);
            
             }, 3000);

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

    gameStep = 2;


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
            "images/room1_map.png",
            "system"
        );

    }, 3000);


    // 5秒後
    setTimeout(() => {

        addMessage(
            "書斎の鍵を取り、書斎内にある日記の写真を送れ。",
            "system"
        );

        showPhotoButton();

    }, 5000);
}


// ========================================
// 暗号④へ進む
// ========================================

function goToFourthRoom() {

    gameStep = 6;


    addMessage(
        "よし。近くに出口があるな。",
        "system"
    );


    setTimeout(() => {

        addMessage(
            "脱出の番号は① → ② → ③ → ④だ。",
            "system"
        );

    }, 2000);


    setTimeout(() => {

        addMessage(
            "最後の④を探しに行き、出口から脱出しろ。",
            "system"
        );

    }, 4000);


    setTimeout(() => {

        addImage(
            "images/room4_map.png",
            "system"
        );

    }, 6000);
}


// ========================================
// 脱出成功
// ========================================

function escapeSuccess() {

    gameStep = 7;


    // 1秒後
    setTimeout(() => {

        addMessage(
            "脱出おめでとう！",
            "system"
        );

    }, 1000);

    // 7秒後
    setTimeout(() => {

        addMessage(
            "クラ発投票お願いします！",
            "system"
        );

    }, 3000);


    // 8秒後
    setTimeout(() => {

        addLinkMessage(
            "クラ発の投票はこちら",
            "https://example.com"
        );

    }, 5000);


    // 8.5秒後
    setTimeout(() => {

        shakeScreen();

    }, 7500);


    // 9秒後
    setTimeout(() => {

        stopShakeScreen();

        addRedMessage(
            "友達になれたね"
        );

    }, 9000);
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


    const normalizedText =
        text
            .replace(/\s/g, "")
            .toLowerCase();


    // ====================================
    // 最初の質問
    // ====================================

    if (gameStep === 0) {

        gameStep = 1;


        setTimeout(() => {

            addMessage(
                "館に入ったら「入った」と送れ。",
                "system"
            );

        }, 1000);


        return;
    }


    // ====================================
    // 入室
    // 「入」が含まれていればOK
    // ====================================

    if (gameStep === 1) {

        if (
            normalizedText.includes("入")
        ) {

            if (!window.enteredStarted) {

                window.enteredStarted =
                    true;

                enteredRoom();

            }

        }

        return;
    }


    // ====================================
    // ①
    // 正解：1 / いち / 一
    // ====================================

    if (gameStep === 3) {

        if (
            normalizedText.includes("1") ||
            normalizedText.includes("いち") ||
            normalizedText.includes("一") ||
            normalizedText.includes("１")
        ) {

            gameStep = 4;


            setTimeout(() => {

                addMessage(
                    "よし。次に廊下下付近にある②の数字を送ってくれ。",
                    "system"
                );

            }, 1000);


            setTimeout(() => {

                addImage(
                    "images/room3_map.png",
                    "system"
                );

            }, 3000);

        }

        return;
    }


    // ====================================
    // ②
    // 正解：9 / きゅう / 九
    // ====================================

    if (gameStep === 4) {

        if (
            normalizedText.includes("9") ||
            normalizedText.includes("きゅう") ||
            normalizedText.includes("九") ||
            normalizedText.includes("９")
        ) {

            gameStep = 5;


            setTimeout(() => {

                addMessage(
                    "いいぞ。③も送れ。",
                    "system"
                );

            }, 1000);

        }

        return;
    }


    // ====================================
    // ③
    // 正解：7 / なな / 七
    // ====================================

    if (gameStep === 5) {

        if (
            normalizedText.includes("7") ||
            normalizedText.includes("なな") ||
            normalizedText.includes("七") ||
            normalizedText.includes("７")
        ) {

            goToFourthRoom();

        }

        return;
    }


    // ====================================
    // ④の部屋
    // 「脱出成功」を待つ
    // ====================================

    if (gameStep === 6) {

        if (
            text === "脱出成功"
        ) {

            escapeSuccess();

        }

        return;
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