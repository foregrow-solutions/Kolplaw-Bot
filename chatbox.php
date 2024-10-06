<?php
/*
Plugin Name: Kolplaw Bot
Description: A simple chatbot plugin for Kolplaw, designed to enhance user interaction by providing real-time assistance and information.
Version: 1.0
Author: Pankaj Kumar
Author URI: https://pankaj-kumar-techie.github.io
*/

// Enqueue the required scripts and styles
function my_chatbox_enqueue_scripts() {
    // Enqueue the chatbox CSS
    wp_enqueue_style('my-chatbox-style', plugin_dir_url(__FILE__) . 'styles.css');

    // Enqueue the chatbox JavaScript, ensuring it loads in the footer
    wp_enqueue_script('my-chatbox-script', plugin_dir_url(__FILE__) . 'chatbox.js', array('jquery'), null, true);
    
    // Localize script to pass the plugin URL to JavaScript
    wp_localize_script('my-chatbox-script', 'chatboxSettings', array(
        'pluginUrl' => plugin_dir_url(__FILE__) // Plugin URL for accessing images and other assets
    ));
}
add_action('wp_enqueue_scripts', 'my_chatbox_enqueue_scripts');

// Inject chatbox HTML into the footer
function my_chatbox_html() {
    ?>
    <button id="open-chatbot" aria-label="Open Chatbot">💬</button>
    <div class="chat-container" id="chat-container" style="display: none;">
        <div class="chat-header">
            <h2>Kolplaw Chatbot</h2>
        </div>
        <div class="chat-messages" id="chat-messages" aria-live="polite">
            <!-- Messages will be dynamically inserted here -->
        </div>
        <div class="chat-input">
            <input type="text" id="user-input" placeholder="Type your message..." aria-label="Message input">
            <button id="send-button" aria-label="Send message">Send</button>
        </div>
    </div>
    <?php
}
add_action('wp_footer', 'my_chatbox_html');
