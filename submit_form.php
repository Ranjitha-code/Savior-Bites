<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $fullname = $_POST['form_fields']['fullname'] ?? '';
    $phoneNo = $_POST['form_fields']['PhoneNo'] ?? '';
    $email = $_POST['form_fields']['email'] ?? '';
    $message = $_POST['form_fields']['message'] ?? '';

    // Set up the recipient email and subject
    $to = "your-email@domain.com"; // Replace with your email address
    $subject = "New Contact Form Submission from Healthy Bites";

    // Create the email content
    $email_content = "Full Name: $fullname\n";
    $email_content .= "Phone Number: $phoneNo\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Message:\n$message\n";

    // Set email headers
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";

     // Send the email
     if (mail($to, $subject, $body, $headers)) {
        // Success message
        echo "Thank you for reaching out! We’ll get back to you soon.";
    } else {
        echo "Sorry, there was an error processing your submission. Please try again.";
    }
}
?>

