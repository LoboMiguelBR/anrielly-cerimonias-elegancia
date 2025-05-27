
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { getWelcomeEmailTemplate } from "./templates/welcomeTemplate.ts"
import { getCompletedEmailTemplate } from "./templates/completedTemplate.ts"
import { EmailSender, EmailRequest } from "./utils/emailSender.ts"
import { EmailValidator } from "./utils/emailValidator.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const emailRequest: EmailRequest = await req.json()
    const { name, email, type, questionarioId } = emailRequest

    console.log('Email request received:', { name, email, type, questionarioId })

    // Validate request
    const validationError = EmailValidator.validate(emailRequest)
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get email configuration
    const emailConfig = EmailValidator.getEmailConfig(type)
    
    // Get email template
    let html: string
    if (type === 'welcome') {
      html = getWelcomeEmailTemplate(name)
    } else {
      html = getCompletedEmailTemplate(name)
    }

    // Initialize email sender
    const emailSender = new EmailSender(Deno.env.get('RESEND_API_KEY')!)

    // Send email to client
    const emailResponse = await emailSender.sendEmail(email, emailConfig.subject, html)
    console.log('Email enviado para cliente:', emailResponse)

    // Send notification email if completed
    if (type === 'completed') {
      const notificationResponse = await emailSender.sendNotificationEmail(name, email, questionarioId)
      console.log('Email de notificação enviado:', notificationResponse)
    }

    return new Response(
      JSON.stringify({ success: true, emailId: emailResponse.data?.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return new Response(
      JSON.stringify({ error: 'Erro ao enviar email', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
