const input = document.getElementById("input");
const send = document.getElementById("send");
const messages = document.getElementById("messages");
const status = document.getElementById("status");


// ========================================
// 効果音
// ========================================

const messageSound = new Audio("sounds/message.mp3");
const ghostSound = new Audio("sounds/ghost.mp3");

// 通知音は少し控えめ
messageSound.volume = 0.5;

// お化けの音は最大
ghostSound.volume = 1.0;


// ========================================
// 通知音
// ========================================

function playMessageSound() {

    messageSound.currentTime = 0;

    messageSound.play().catch(() => {});

}


// ========================================
// お化け出現音
// ========================================

function playGhostSound() {

    ghostSound.currentTime = 0;

    ghostSound.play().catch(() => {});

}


// ========================================
// メッセージを追加
// ========================================

function addMessage(text, type) {

    const message = document.createElement("div");

    message.classList.add("message");
    message.classList.add(type);

    message.textContent = text;

    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;


    // システムメッセージなら通知音
    if (type === "system") {

        playMessageSound();

    }
}


// ========================================
// 画像を追加
// ========================================

function addImage(src, type) {

    const message = document.createElement("div");

    message.classList.add("message");
    message.classList.add(type);

    const image = document.createElement("img");

    image.src = src;

    image.style.maxWidth = "100%";
    image.style.borderRadius = "8px";
    image.style.display = "block";

    message.appendChild(image);

    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;
}


// ========================================
// URL付きメッセージ
// ========================================

function addLinkMessage(text, url) {

    const message = document.createElement("div");

    message.classList.add("message");
    message.classList.add("system");


    const textElement = document.createElement("div");

    textElement.textContent = text;


    const link = document.createElement("a");

    link.href = url;

    link.textContent = url;

    link.target = "_blank";

    link.rel = "noopener noreferrer";


    // URLの見た目
    link.style.color = "#4da6ff";

    link.style.textDecoration = "underline";

    link.style.display = "block";

    link.style.marginTop = "6px";


    message.appendChild(textElement);

    message.appendChild(link);


    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;


    // 通知音
    playMessageSound();

}


// ========================================
// 画面を揺らす
// ========================================

function shakeScreen() {

    const chat = document.querySelector(".chat");

    if (!chat) {

        return;

    }


    chat.classList.remove("horror-shake");

    void chat.offsetWidth;

    chat.classList.add("horror-shake");

}


// ========================================
// 画面の揺れを止める
// ========================================

function stopShake() {

    const chat = document.querySelector(".chat");

    if (!chat) {

        return;

    }


    chat.classList.remove("horror-shake");

}


// ========================================
// 一瞬暗くする
// ========================================

function blackoutScreen() {

    const blackout = document.createElement("div");

    blackout.classList.add("blackout");

    document.body.appendChild(blackout);


    setTimeout(() => {

        blackout.remove();

    }, 300);

}


// ========================================
// 「ミツケタ」専用黒画面
// ========================================

function showFoundMessage(letter) {

    let screen = document.getElementById("foundScreen");


    // 黒画面がなければ作成
    if (!screen) {

        screen = document.createElement("div");

        screen.id = "foundScreen";

        screen.classList.add("found-screen");

        document.body.appendChild(screen);

    }


    // 前の文字を消す
    screen.innerHTML = "";


    const letterElement = document.createElement("div");

    letterElement.classList.add("found-letter");

    letterElement.textContent = letter;


    screen.appendChild(letterElement);

}


// ========================================
// 「ミツケタ」画面を消す
// ========================================

function hideFoundScreen() {

    const screen = document.getElementById("foundScreen");

    if (screen) {

        screen.remove();

    }

}


// ========================================
// 写真送信ボタン
// ========================================

function showPhotoButton() {

    if (document.getElementById("photoButton")) {

        return;

    }


    const button = document.createElement("button");

    button.id = "photoButton";

    button.textContent = "📷 写真を送る";


    button.style.display = "block";

    button.style.margin = "10px auto";

    button.style.padding = "12px 20px";

    button.style.border = "none";

    button.style.borderRadius = "10px";

    button.style.background = "#444";

    button.style.color = "white";

    button.style.fontSize = "16px";


    const fileInput = document.createElement("input");

    fileInput.type = "file";

    fileInput.accept = "image/*";

    fileInput.capture = "environment";

    fileInput.style.display = "none";


    // ボタンを押したらカメラ・写真選択
    button.addEventListener("click", function() {

        fileInput.click();

    });


    // 写真選択
    fileInput.addEventListener("change", function() {

        const file = fileInput.files[0];


        if (!file) {

            return;

        }


        // ====================================
        // 客が送った写真を表示
        // ====================================

        const imageURL = URL.createObjectURL(file);

        addImage(
            imageURL,
            "user"
        );


        // ボタンを削除
        button.remove();

        fileInput.remove();


        // ====================================
        // 2秒後
        // ====================================

        setTimeout(() => {

            addMessage(
                "画像を確認した。\n"
                + "その部屋にしばらく留まっておけ。",
                "system"
            );

        }, 2000);


        // ====================================
        // さらに3秒後
        // 文字化け開始
        // ====================================

        setTimeout(() => {


            // --------------------------------
            // OFFLINE
            // --------------------------------

            status.textContent = "● OFFLINE";


            // --------------------------------
            // 画面を揺らす
            // --------------------------------

            shakeScreen();


            // --------------------------------
            // 一瞬暗くする
            // --------------------------------

            blackoutScreen();


            // --------------------------------
            // 文字化け①
            // --------------------------------

            addMessage(
                "縺薙�縺ｮ縺ｧ……",
                "system"
            );


            // --------------------------------
            // 1秒後
            // --------------------------------

            setTimeout(() => {

                addMessage(
                    "繧医￥縺ｿ縺ｨ縺ｦ……",
                    "system"
                );

            }, 1000);


            // --------------------------------
            // 2秒後
            // --------------------------------

            setTimeout(() => {

                addMessage(
                    "縺薙�縺ｦ縺ｿ縺ｾ縺吶�",
                    "system"
                );

            }, 2000);


            // --------------------------------
            // 3秒後
            // --------------------------------

            setTimeout(() => {

                addMessage(
                    "縺ゅ�縺�",
                    "system"
                );

            }, 3000);


            // --------------------------------
            // 4秒後
            // --------------------------------

            setTimeout(() => {

                addMessage(
                    "縺ｿ縺､縺代◆",
                    "system"
                );

            }, 4000);


            // ====================================
            // 7秒後
            // ミ
            // ====================================

            setTimeout(() => {

                showFoundMessage("ミ");

            }, 7000);


            // ====================================
            // 8秒後
            // ツ
            // ====================================

            setTimeout(() => {

                showFoundMessage("ツ");

            }, 8000);


            // ====================================
            // 9秒後
            // ケ
            // ====================================

            setTimeout(() => {

                showFoundMessage("ケ");

            }, 9000);


            // ====================================
            // 10秒後
            // タ
            // ====================================

            setTimeout(() => {

                showFoundMessage("タ");


                // 「タ」が出た瞬間に
                // 揺れを停止

                stopShake();

            }, 10000);


            // ====================================
            // 11秒後
            // お化け出現音
            // ====================================

            setTimeout(() => {

                playGhostSound();

            }, 11000);


            // ====================================
            // 20秒後
            // 「タ」から10秒
            // ====================================

            setTimeout(() => {


                // 黒画面を消す

                hideFoundScreen();


                // ONLINEに戻す

                status.textContent = "● ONLINE";


                addMessage(
                    "再接続できたようだ。",
                    "system"
                );

            }, 20000);


            // ====================================
            // 21秒後
            // ====================================

            setTimeout(() => {

                addMessage(
                    "間取り図の全体を送る。",
                    "system"
                );

            }, 21000);


            // ====================================
            // 22秒後
            // 全体図
            // ====================================

            setTimeout(() => {

                addImage(
                    "images/full_map.png",
                    "system"
                );

            }, 22000);


            // ====================================
            // 23秒後
            // 脱出指示
            // ====================================

            setTimeout(() => {

                addMessage(
                    "脱出するんだ。成功したら「脱出成功」と送れ。",
                    "system"
                );

            }, 23000);


        }, 5000);

    });


    messages.appendChild(button);

    messages.scrollTop = messages.scrollHeight;

}


// ========================================
// 「入った」の処理
// ========================================

function enteredRoom() {


    // ====================================
    // 1.5秒後
    // ====================================

    setTimeout(() => {

        addMessage(
            "この部屋を調査しろ。",
            "system"
        );

    }, 1500);


    // ====================================
    // 3.5秒後
    // 部屋の間取り図
    // ====================================

    setTimeout(() => {

        addImage(
            "images/room_map.png",
            "system"
        );

    }, 3500);


    // ====================================
    // 5秒後
    // ====================================

    setTimeout(() => {

        addMessage(
            "この部屋で見つけたものの画像を送れ。",
            "system"
        );


        showPhotoButton();

    }, 5000);

}


// ========================================
// メッセージ送信
// ========================================

function sendMessage() {

    const text = input.value.trim();


    // 空欄
    if (text === "") {

        return;

    }


    // ====================================
    // 客のメッセージ
    // ====================================

    addMessage(
        text,
        "user"
    );


    input.value = "";


    // ====================================
    // 「入った」
    // ====================================

    if (text === "入った") {

        enteredRoom();

    }


    // ====================================
    // 「脱出」
    // ====================================

    if (text === "脱出成功") {


        // --------------------------------
        // 1秒後
        // --------------------------------

        setTimeout(() => {

            addMessage(
                "脱出を確認した。",
                "system"
            );

        }, 1000);


        // --------------------------------
        // 2.5秒後
        // --------------------------------

        setTimeout(() => {

            addMessage(
                "おめでとう。\n無事に脱出した。",
                "system"
            );

        }, 2500);


        // --------------------------------
        // 4秒後
        // URL
        // --------------------------------

        setTimeout(() => {

            addLinkMessage(
                "クラ発投票お願いします！",
                "https://example.com"
            );

        }, 4000);

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

        if (event.key === "Enter") {

            sendMessage();

        }

    }
);