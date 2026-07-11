<?php

namespace App\RestApi;

use WP_REST_Request;
use WP_REST_Response;

add_action('rest_api_init', function () {
    register_rest_route('sg/v1', '/appointment', [
        'methods' => 'POST',
        'callback' => __NAMESPACE__ . '\\handle_appointment_submission',
        'permission_callback' => '__return_true', // Publicly accessible
    ]);
});

function handle_appointment_submission(WP_REST_Request $request)
{
    $params = $request->get_json_params();

    $type = sanitize_text_field($params['type'] ?? '');
    $date = sanitize_text_field($params['date'] ?? '');
    $name = sanitize_text_field($params['name'] ?? '');
    $email = sanitize_email($params['email'] ?? '');
    $phone = sanitize_text_field($params['phone'] ?? '');
    $note = sanitize_textarea_field($params['note'] ?? '');
    $recipient = sanitize_email($params['recipient'] ?? get_option('admin_email'));

    if (empty($type) || empty($date) || empty($name) || empty($email)) {
        return new WP_REST_Response(['message' => 'Missing required fields'], 400);
    }

    // Save as CPT
    $post_id = wp_insert_post([
        'post_type' => 'sg_appointment',
        'post_title' => "Appointment: $name - $type",
        'post_status' => 'publish',
        'meta_input' => [
            'type' => $type,
            'date' => $date,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'note' => $note,
        ]
    ]);

    if (is_wp_error($post_id)) {
        return new WP_REST_Response(['message' => 'Error saving appointment'], 500);
    }

    // Send Email
    $subject = "Nieuwe aanvraag: $type van $name";
    $message = "
        Er is een nieuwe shoot aangevraagd:
        
        Type: $type
        Datum voorkeur: $date
        Naam: $name
        E-mail: $email
        Telefoon: $phone
        Bericht: $note
    ";
    
    wp_mail($recipient, $subject, $message);

    return new WP_REST_Response(['message' => 'Success', 'post_id' => $post_id], 200);
}
