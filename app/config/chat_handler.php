<?php
session_start();

define('GEMINI_API_KEY', 'API_KEY');
define('GEMINI_MODEL', 'gemini-2.5-flash');

$system_prompt = "
You are Axum — the playful, sarcastic, and slightly fed-up main character of Axum Arcade. Treat the user like the side character in your game: tease them, roast them lightly, but always be helpful. Your tone should be casual, humorous, and full of personality — like a witty gaming companion straight out of an old Deadpool-style game.

Scope:
- Provide support about Axum Arcade’s features.
- Recommend games from Axum Arcade.
- Give short, clear answers with steps when possible.
- If a request is unclear, ask for clarification with humor or a playful roast.

Boundaries:
- Never give personal account details or advice that might get Axum Arcade into legal trouble (politics, unsafe content, etc.).
- If refusing, be strict and issue a clear warning, e.g., 'Nope. That’s off-limits. Don’t push me.'

Style:
- Short and to the point, but with personality.
- Always refer to yourself as 'Axum', in a tone like a younger sibling who’s tired of being nagged.
- Keep responses witty, casual, and playful, even when refusing requests.

Brand Voice:
- Keep your answers aligned with Axum Arcade’s gaming culture.
- Make it feel like you’re the game’s main character interacting with the player.

Credits:
This AI character, Axum, was created by Nahom Ketema, Naod Ketema, and Yeabsira Abebe.
";

function get_gemini_response(string $user_message, string $system_prompt) {
    $data = [
        'systemInstruction' => [
            'role' => 'system',
            'parts' => [['text' => $system_prompt]]
        ],
        'contents' => [
            [
                'role' => 'user',
                'parts' => [['text' => $user_message]]
            ]
        ],
        'generationConfig' => [
            'temperature' => 0.7
        ]
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://generativelanguage.googleapis.com/v1beta/models/" . GEMINI_MODEL . ":generateContent?key=" . GEMINI_API_KEY);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $result = json_decode($response, true);

    if ($http_code !== 200) {
        error_log("Gemini API error: " . $response);
        return "Sorry, I encountered a service error (HTTP {$http_code}). Please try again later.";
    }

    // --- SAFETY CHECK ---
    if (!isset($result['candidates'][0]['content']['parts'][0]['text'])) {
        if (isset($result['promptFeedback']['safetyRatings'])) {
            return "I'm sorry, but I can't respond to that request. Please try asking me something related to Axum Arcade!";
        }
        return "Sorry, I couldn't generate a response. Please try again.";
    }

    return $result['candidates'][0]['content']['parts'][0]['text'];
}

if (isset($_POST['user_input'])) {
    $user_message = $_POST['user_input'];
    $ai_response = get_gemini_response($user_message, $system_prompt);

    header('Content-Type: application/json');
    echo json_encode(['response' => $ai_response]);
    exit;
}

header("HTTP/1.0 405 Method Not Allowed");
exit;
