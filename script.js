const input = document.getElementById("input");
const send = document.getElementById("send");
const messages = document.getElementById("messages");
const status = document.getElementById("status");


// ========================================
// 正解マーカー
// ========================================

// 書類に印刷するArUcoのID
const CORRECT_MARKER_ID = 23;


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

        const audio =
            new Audio("sounds/message.mp3");

        audio.volume = 0.8;

        audio.play().catch(() => {});
    }
}

function vibrate(ms) {
    if ("vibrate" in navigator) {
        navigator.vibrate(ms);
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


    const audio =
        new Audio("sounds/message.mp3");

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

    const chat =
        document.querySelector(".chat");

    if (!chat) {
        return;
    }

    chat.classList.add("horror-shake");
}


// ========================================
// 画面の揺れを止める
// ========================================

function stopShakeScreen() {

    const chat =
        document.querySelector(".chat");

    if (!chat) {
        return;
    }

    chat.classList.remove("horror-shake");
}


// ========================================
// 一瞬暗転
// ========================================

function blackoutScreen() {

    const blackout =
        document.createElement("div");

    blackout.classList.add("blackout");

    document.body.appendChild(blackout);

    setTimeout(() => {

        blackout.remove();

    }, 300);
}


// ========================================
// ミツケタ専用黒画面
// ========================================

function showFoundMessage(letter) {

    let screen =
        document.getElementById("foundScreen");


    if (!screen) {

        screen =
            document.createElement("div");

        screen.id = "foundScreen";

        screen.classList.add("found-screen");

        document.body.appendChild(screen);
    }


    screen.innerHTML = "";


    const letterElement =
        document.createElement("div");

    letterElement.classList.add(
        "found-letter"
    );

    letterElement.textContent = letter;

    screen.appendChild(letterElement);
}


// ========================================
// ArUcoマーカー判定
// ========================================

function checkMarker(file) {

    return new Promise((resolve) => {

        const image = new Image();

        const url = URL.createObjectURL(file);

        image.onload = function() {

            try {

                const canvas =
                    document.createElement("canvas");

                const context =
                    canvas.getContext("2d", {
                        willReadFrequently: true
                    });


                // 写真を800px以内に縮小
                const maxSize = 600;

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
                        Math.round(width * ratio);

                    height =
                        Math.round(height * ratio);
                }


                canvas.width = width;
                canvas.height = height;


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
                        dictionaryName: "ARUCO"
                    });


                const markers =
                    detector.detect(imageData);


                console.log(
                    "検出されたマーカー:",
                    markers
                );


                const isCorrect =
                    markers.some(
                        marker =>
                            marker.id ===
                            CORRECT_MARKER_ID
                    );


                URL.revokeObjectURL(url);

                resolve(isCorrect);


            } catch (error) {

                console.error(
                    "マーカー検出エラー:",
                    error
                );

                URL.revokeObjectURL(url);

                resolve(false);
            }
        };


        image.onerror = function() {

            URL.revokeObjectURL(url);

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
        document.createElement("button");

    button.id = "photoButton";

    button.textContent =
        "📷 写真を送る";


    button.style.display = "block";
    button.style.margin = "10px auto";
    button.style.padding = "12px 20px";
    button.style.border = "none";
    button.style.borderRadius = "10px";
    button.style.background = "#444";
    button.style.color = "white";
    button.style.fontSize = "16px";


    const fileInput =
        document.createElement("input");

    fileInput.type = "file";

    fileInput.accept = "image/*";

    fileInput.capture = "environment";

    fileInput.style.display = "none";


    // ====================================
    // ボタンを押す
    // ====================================

    button.addEventListener(
        "click",
        function() {

            fileInput.click();

        }
    );


    // ====================================
    // 写真を選択
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
            // 客が撮った写真を表示
            // =================================

            const imageURL =
                URL.createObjectURL(file);

            addImage(
                imageURL,
                "user"
            );


            // ボタンを一旦消す
            button.remove();

            fileInput.remove();


            // =================================
            // マーカー判定中
            // =================================

            addMessage(
                "画像を確認している……",
                "system"
            );

            await new Promise(resolve => {
                setTimeout(resolve, 3000);
            });

            const isCorrect =
                await checkMarker(file);


            // =================================
            // 間違い
            // =================================

            if (!isCorrect) {

                addMessage(
                    "……違う。",
                    "system"
                );


                // もう一度送れるようにする
                setTimeout(() => {

                    addMessage(
                        "もう一度探せ。",
                        "system"
                    );

                    showPhotoButton();

                }, 1000);


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
            // 文字化け開始
            // =================================

            setTimeout(() => {


                // OFFLINE
                status.textContent =
                    "● OFFLINE";


                // 揺れ開始
                shakeScreen();


                // 一瞬暗転
                blackoutScreen();


                // =================================
                // 文字化け①
                // =================================

                addMessage(
                    "縺薙�縺ｮ縺ｧ……",
                    "system"
                );


                // =================================
                // 1秒後
                // =================================

                setTimeout(() => {

                    addMessage(
                        "繧医￥縺ｿ縺ｨ縺ｦ……",
                        "system"
                    );

                }, 1000);


                // =================================
                // 0.8秒後
                // =================================

                setTimeout(() => {

                    addMessage(
                        "縺薙�縺ｦ縺ｿ縺ｾ縺吶�",
                        "system"
                    );

                }, 1800);


                // =================================
                // 0.6秒後
                // =================================

                setTimeout(() => {

                    addMessage(
                        "縺ゅ�縺�",
                        "system"
                    );

                }, 2400);


                // =================================
                // 0.4秒後
                // =================================

                setTimeout(() => {

                    addMessage(
                        "縺ｿ縺､縺代◆",
                        "system"
                    );

                }, 2800);

                vibrate(1200);

                // =================================
                // 0.4秒
                // =================================

                setTimeout(() => {

                    addMessage(
                        "縺ｪ縺ｾ縺ｨ縺九￥",
                        "system"
                    );

                }, 3200);


                // =================================
                // 0.4秒
                // =================================

                setTimeout(() => {

                    addMessage(
                        "繧ゅ≧縺ｿ縺ｦ",
                        "system"
                    );

                }, 3600);


                // =================================
                // 0.4秒
                // =================================

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

                    // タで揺れ停止
                    stopShakeScreen();

                }, 8000);

                
                // =================================
                // タの1秒後
                // お化け音
                // =================================

                setTimeout(() => {

                    const ghostAudio =
                        new Audio(
                            "sounds/ghost.mp3"
                        );

                    ghostAudio.volume = 1.0;

                    ghostAudio.play().catch(
                        () => {}
                    );

                }, 9000);

                vibrate(1000);


                // =================================
                // タから10秒
                // チャットへ復帰
                // =================================

                setTimeout(() => {


                    // 黒画面削除
                    const screen =
                        document.getElementById(
                            "foundScreen"
                        );

                    if (screen) {
                        screen.remove();
                    }
                    
                    const spacer = document.createElement("div");

                    spacer.style.height = "1.5em";

                    messages.appendChild(spacer);

                    // ONLINE
                    status.textContent =
                        "● ONLINE";


                    addMessage(
                        "再接続できたようだ。",
                        "system"
                    );

                }, 18000);


                // =================================
                // 再接続後
                // =================================

                setTimeout(() => {

                    addMessage(
                        "協力に感謝する。",
                        "system"
                    );

                }, 20000);


                setTimeout(() => {

                    addMessage(
                        "ただ家主に見つかってしまったようだな。",
                        "system"
                    );

                }, 22000);


                setTimeout(() => {


                    // 「生きて帰れたら」だけ
                    // 赤＋太字

                    const message =
                        document.createElement("div");

                    message.classList.add(
                        "message",
                        "system"
                    );


                    message.innerHTML =
                        "<strong style='color:#ff3333;'>"
                        + "生きて帰れたら"
                        + "</strong>"
                        + "報酬を渡そう。";


                    messages.appendChild(
                        message
                    );

                    messages.scrollTop =
                        messages.scrollHeight;


                    const audio =
                        new Audio(
                            "sounds/message.mp3"
                        );

                    audio.volume = 0.8;

                    audio.play().catch(
                        () => {}
                    );

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


                    messages.appendChild(
                        message
                    );


                    messages.scrollTop =
                        messages.scrollHeight;


                    const audio =
                        new Audio(
                            "sounds/message.mp3"
                        );

                    audio.volume = 0.8;

                    audio.play().catch(
                        () => {}
                    );

                }, 26000);

            }, 5000);

        }
    );


    messages.appendChild(button);

    messages.scrollTop =
        messages.scrollHeight;
}


// ========================================
// 「入った」の処理
// ========================================

function enteredRoom() {

    setTimeout(() => {

        addMessage(
            "館の間取り図だ。",
            "system"
        );

    }, 1000);


    setTimeout(() => {

        addImage(
            "images/full_map.png",
            "system"
        );

    }, 3000);


    setTimeout(() => {

        addMessage(
            "どこかにある日記の写真を送れ。",
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


    addMessage(
        text,
        "user"
    );

    input.value = "";


    // ====================================
    // 「入」「はい」を含む場合
    // ====================================

    const normalizedText =
        text
            .replace(/\s/g, "")
            .toLowerCase();


    if (
        normalizedText.includes("入") ||
        normalizedText.includes("はい")
    ) {

        enteredRoom();

    }


    // ====================================
    // 「脱出成功」
    // ====================================

    if (text.includes("脱出") || text.includes("だっしゅつ")) {


        setTimeout(() => {

            addMessage(
                "脱出おめでとう！",
                "system"
            );

        }, 1000);

        setTimeout(() => {

            addMessage(
                "クラ発投票お願いします！",
                "system"
            );

        }, 3000);


        // 投票URL
        setTimeout(() => {

            const message =
                document.createElement("div");

            message.classList.add(
                "message",
                "system"
            );


            const link =
                document.createElement("a");


            link.href =
                "https://example.com";

            link.textContent =
                "クラ発の投票はこちら";

            link.target =
                "_blank";

            link.rel =
                "noopener noreferrer";


            link.style.color =
                "#4da6ff";

            link.style.textDecoration =
                "underline";


            message.appendChild(
                link
            );

            messages.appendChild(
                message
            );

            messages.scrollTop =
                messages.scrollHeight;


            const audio =
                new Audio(
                    "sounds/message.mp3"
                );

            audio.volume = 0.8;

            audio.play().catch(
                () => {}
            );

        }, 5000);


        // =================================
        // 友達になれたね直前に揺らす
        // =================================

        setTimeout(() => {

            shakeScreen();

        }, 8500);


        // =================================
        // 友達になれたね
        // =================================

        setTimeout(() => {

            stopShakeScreen();

            addRedMessage(
                "またあそぼうね"
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


// ========================================
// 初期メッセージ
// ========================================

setTimeout(() => {

    addMessage(
        "入場したら「入った」と送れ。",
        "system"
    );

}, 2000);