const input = document.getElementById("input");
const send = document.getElementById("send");
const messages = document.getElementById("messages");
const status = document.getElementById("status");


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

        const audio = new Audio("sounds/message.mp3");

        audio.volume = 0.8;

        audio.play().catch(() => {});
    }
}


// ========================================
// 赤文字メッセージ
// ========================================

function addRedMessage(text) {

    const message = document.createElement("div");

    message.classList.add("message");
    message.classList.add("system");

    message.textContent = text;

    message.style.color = "red";
    message.style.fontWeight = "bold";

    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;


    const audio = new Audio("sounds/message.mp3");

    audio.volume = 0.8;

    audio.play().catch(() => {});
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
// 画面を揺らす
// ========================================

function shakeScreen() {

    const chat = document.querySelector(".chat");

    if (!chat) {
        return;
    }

    chat.classList.add("horror-shake");
}


// ========================================
// 画面の揺れを止める
// ========================================

function stopShakeScreen() {

    const chat = document.querySelector(".chat");

    if (!chat) {
        return;
    }

    chat.classList.remove("horror-shake");
}


// ========================================
// 一瞬暗転
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


    if (!screen) {

        screen = document.createElement("div");

        screen.id = "foundScreen";

        screen.classList.add("found-screen");

        document.body.appendChild(screen);
    }


    screen.innerHTML = "";


    const letterElement = document.createElement("div");

    letterElement.classList.add("found-letter");

    letterElement.textContent = letter;

    screen.appendChild(letterElement);
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


    // ====================================
    // 写真ボタン
    // ====================================

    button.addEventListener("click", function() {

        fileInput.click();

    });


    // ====================================
    // 写真を選択
    // ====================================

    fileInput.addEventListener("change", function() {

        const file = fileInput.files[0];

        if (!file) {
            return;
        }


        // ====================================
        // 客が送った写真
        // ====================================

        const imageURL = URL.createObjectURL(file);

        addImage(
            imageURL,
            "user"
        );


        button.remove();

        fileInput.remove();


        // ====================================
        // 2秒後
        // ====================================

        setTimeout(() => {

            addMessage(
                "画像を確認した。\nその部屋にしばらく留まっておけ。",
                "system"
            );

        }, 2000);


        // ====================================
        // さらに3秒後
        // 文字化け開始
        // ====================================

        setTimeout(() => {

            // OFFLINE
            status.textContent = "● OFFLINE";


            // 揺れ開始
            shakeScreen();


            // 一瞬暗転
            blackoutScreen();


            // ====================================
            // 文字化け①
            // ====================================

            addMessage(
                "縺薙�縺ｮ縺ｧ……",
                "system"
            );


            // ====================================
            // 文字化け②
            // 1秒後
            // ====================================

            setTimeout(() => {

                addMessage(
                    "繧医￥縺ｿ縺ｨ縺ｦ……",
                    "system"
                );

            }, 1000);


            // ====================================
            // 文字化け③
            // 0.8秒後
            // ====================================

            setTimeout(() => {

                addMessage(
                    "縺薙�縺ｦ縺ｿ縺ｾ縺吶�",
                    "system"
                );

            }, 1800);


            // ====================================
            // 文字化け④
            // 0.6秒後
            // ====================================

            setTimeout(() => {

                addMessage(
                    "縺ゅ�縺�",
                    "system"
                );

            }, 2400);


            // ====================================
            // 文字化け⑤
            // 0.4秒後
            // ====================================

            setTimeout(() => {

                addMessage(
                    "縺ｿ縺､縺代◆",
                    "system"
                );

            }, 2800);


            // ====================================
            // ここから0.2秒間隔
            // ====================================

            setTimeout(() => {

                addMessage(
                    "縺ｪ縺ｾ縺ｨ縺九￥",
                    "system"
                );

            }, 3200);


            setTimeout(() => {

                addMessage(
                    "繧ゅ≧縺ｿ縺ｦ",
                    "system"
                );

            }, 3600);


            setTimeout(() => {

                addMessage(
                    "縺ｿ縺､縺代◆",
                    "system"
                );

            }, 3800);


            // ====================================
            // ミ
            // 最後の文字化けから1秒後
            // ====================================

            setTimeout(() => {

                showFoundMessage("ミ");

            }, 4400);


            // ====================================
            // ツ
            // ====================================

            setTimeout(() => {

                showFoundMessage("ツ");

            }, 5400);


            // ====================================
            // ケ
            // ====================================

            setTimeout(() => {

                showFoundMessage("ケ");

            }, 6400);


            // ====================================
            // タ
            // ====================================

            setTimeout(() => {

                showFoundMessage("タ");

            }, 7400);


            // ====================================
            // 「タ」の1秒後
            // お化けの音
            // ====================================

            setTimeout(() => {

                const ghostAudio =
                    new Audio("sounds/ghost.mp3");

                ghostAudio.volume = 1.0;

                ghostAudio.play().catch(() => {});

            }, 8400);


            // ====================================
            // 「タ」から10秒後
            // チャット画面へ戻る
            // ====================================

            setTimeout(() => {

                // 揺れ停止
                stopShakeScreen();


                // 黒画面削除
                const screen =
                    document.getElementById("foundScreen");

                if (screen) {
                    screen.remove();
                }


                // ONLINE
                status.textContent = "● ONLINE";


                // 空白を入れる
                const spacer = document.createElement("div");

                spacer.style.height = "40px";

                messages.appendChild(spacer);


                // 再接続メッセージ
                addMessage(
                    "再接続できたようだ。",
                    "system"
                );

            }, 17400);


            // ====================================
            // 再接続後①
            // ====================================

            setTimeout(() => {

                addMessage(
                    "協力に感謝する。",
                    "system"
                );

            }, 19400);


            // ====================================
            // 再接続後②
            // ====================================

            setTimeout(() => {

                addMessage(
                    "ただ家主に見つかってしまったようだな。",
                    "system"
                );

            }, 21400);


            // ====================================
            // 再接続後③
            // ====================================

            setTimeout(() => {

                const message = document.createElement("div");

                message.classList.add("message");
                message.classList.add("system");

                message.innerHTML =
                    "<strong style='color:#ff3333;'>生きて帰れたら</strong>報酬を渡そう。";

                messages.appendChild(message);

                messages.scrollTop = messages.scrollHeight;

            }, 23400);


            // ====================================
            // 再接続後④
            // ====================================

            setTimeout(() => {

                const message = document.createElement("div");

                message.classList.add(
                    "message",
                    "system",
                    "disconnect-message"
                );

                message.textContent =
                    "――匿名さんの接続が切れました――";

                messages.appendChild(message);

                messages.scrollTop = messages.scrollHeight;

            }, 25400);

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
    // 1秒後
    // ====================================

    setTimeout(() => {
        addImage(
            "images/full_map.png",
            "system"
        );

    }, 1000);


    // ====================================
    // 3秒後
    // ====================================

    setTimeout(() => {
        addMessage(
            "この館の間取り図だ。",
            "system"
        );
        

    }, 3000);


    // ====================================
    // 5秒後
    // ====================================

    setTimeout(() => {

        addMessage(
            "どこかにある日記の写真を送ってくれ。",
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
    // 「入った」
    // 「はいった」
    // ====================================

    const normalizedText =
        text
            .replace(/\s/g, "")
            .toLowerCase();


    if (
        normalizedText === "入った" ||
        normalizedText === "はいった"
    ) {

        enteredRoom();

    }


    // ====================================
    // 「脱出成功」
    // ====================================

    if (text === "脱出成功") {


        // ====================================
        // 1秒後
        // ====================================

        setTimeout(() => {

            addMessage(
                "脱出おめでとう！",
                "system"
            );

        }, 1000);


        // ====================================
        // 3秒後
        // 全体図
        // ====================================

        // ====================================
        // 7秒後
        // ====================================

        setTimeout(() => {

            addMessage(
                "クラ発投票お願いします！",
                "system"
            );

        }, 3000);


        // 投票URL
// ====================================

        setTimeout(() => {

            const message = document.createElement("div");

            message.classList.add("message");
            message.classList.add("system");

            const link = document.createElement("a");

            link.href = "https://example.com";
            link.textContent = "クラ発の投票はこちら";
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            link.style.color = "#4da6ff";
            link.style.textDecoration = "underline";

            message.appendChild(link);

            messages.appendChild(message);

            messages.scrollTop = messages.scrollHeight;

        }, 4000);


        // ====================================
        // 9秒後
        // ====================================

        // ====================================
        // 8.5秒後
        // 「友達になれたね」の直前に揺らす
        // ====================================

        setTimeout(() => {

            shakeScreen();

        }, 8500);


        // ====================================
        // 9秒後
        // 揺れを止めて「友達になれたね」
        // ====================================

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

        if (event.key === "Enter") {

            sendMessage();

        }

    }
);

setTimeout(() => {

    addMessage(
        "入場したら「入った」と送れ。",
        "system"
    );

}, 2000);