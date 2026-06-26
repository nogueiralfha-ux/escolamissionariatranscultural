import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Init Gemini SDK
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route for AI Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Mensagem é requerida" });
      }

      if (!process.env.GEMINI_API_KEY) {
         return res.status(500).json({ error: "Chave de API do Gemini não configurada no servidor." });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: message,
        config: {
          systemInstruction: "Você é o assistente virtual da Escola Missionária Transcultural. Seu objetivo é ajudar alunos em pesquisas sobre missões, história cristã, povos não alcançados, teologia e estratégias de campo. Seja educado, objetivo e inspirador."
        }
      });
      
      res.json({ text: response.text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Erro ao comunicar com a inteligência artificial." });
    }
  });

  app.post("/api/atlas/search", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Query vazia" });
      }

      if (!process.env.GEMINI_API_KEY) {
         return res.status(500).json({ error: "Chave do Gemini ausente" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Retorne um array JSON (sem formatação markdown, COMEÇANDO COM [ E TERMINANDO COM ]) de até 10 povos não alcançados, marginalizados ou com necessidades missionárias para a busca: "${query}". \nO JSON deve conter objetos com o seguinte esquema obrigatório: \n{"id": número único, "name": "Nome", "country": "País de origem ou local", "population": "Tamanho estimado", "religion": "Religião/Crença", "status": "Não Alcançado ou Pouco Alcançado", "urgent": boolean, "ethnicities": "Etnias/Tribos", "needs": "Maiores necessidades (ex: bíblias, saúde)", "coordinates": [longitude float, latitude float]}\nSeja realístico na medida do possível baseando-se em dados de missões (Joshua Project etc). Coordenadas devem estar corretas para o local. Se a busca for "America do Sul", traga do Peru, Brasil, Colômbia, etc.`,
      });
      
      let rawText = response.text || "[]";
      rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

      try {
        const data = JSON.parse(rawText);
        res.json({ results: data });
      } catch (e) {
        res.json({ results: [] });
      }
    } catch (error: any) {
      console.error("Erro detalhado do Gemini:", error.message || error);
      res.status(500).json({ error: "Erro na IA", details: error.message });
    }
  });

  // API Route for Custom Checkout (Gateway Próprio Asaas)
  app.post("/api/checkout", async (req, res) => {
    try {
      const { 
        productName, 
        productType, 
        amount, 
        billingType, 
        paymentMethod, 
        name, 
        email, 
        phone, 
        cpfCnpj,
        creditCard
      } = req.body;
      
      const asaasKey = process.env.ASAAS_API_KEY;
      if (!asaasKey) {
        return res.status(500).json({ error: "Chave da API do Asaas não configurada no servidor." });
      }

      // Headers para requisições no Asaas (Ambiente produção ou sandbox dependendo da chave)
      const asaasHeaders = {
        'Content-Type': 'application/json',
        'access_token': asaasKey
      };

      const isProduction = asaasKey.startsWith('$');
      const baseUrl = isProduction ? "https://api.asaas.com/v3" : "https://sandbox.asaas.com/api/v3";

      // 1. Criar ou Buscar Cliente no Asaas
      const customerBody = {
        name,
        email,
        phone,
        cpfCnpj,
        notificationDisabled: false
      };

      const customerResponse = await fetch(`${baseUrl}/customers`, {
        method: 'POST',
        headers: asaasHeaders,
        body: JSON.stringify(customerBody)
      });

      const customerData = await customerResponse.json();
      if (customerData.errors) {
        return res.status(400).json({ error: "Erro ao criar cliente no Asaas", details: customerData.errors });
      }

      const customerId = customerData.id;
      const parsedAmount = parseFloat(amount);
      const isSubscription = productType === 'subscription';

      // Mapear método de pagamento para o Asaas
      let asaasPaymentMethod = 'PIX';
      if (paymentMethod === 'card' || paymentMethod === 'credit_card') asaasPaymentMethod = 'CREDIT_CARD';
      if (paymentMethod === 'boleto') asaasPaymentMethod = 'BOLETO';

      // 2. Criar Cobrança Recorrente (Assinatura) ou Única
      if (isSubscription) {
        // Criar Assinatura Recorrente no Asaas (/v3/subscriptions)
        const subscriptionBody: any = {
          customer: customerId,
          billingType: asaasPaymentMethod,
          value: parsedAmount,
          nextDueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Amanhã
          cycle: billingType === 'annual' ? 'YEARLY' : 'MONTHLY',
          description: `Assinatura: ${productName}`
        };

        if (asaasPaymentMethod === 'CREDIT_CARD' && creditCard) {
          subscriptionBody.creditCard = {
            holderName: creditCard.holderName,
            number: creditCard.number,
            expiryMonth: creditCard.expiryMonth,
            expiryYear: creditCard.expiryYear,
            ccv: creditCard.cvv
          };
          subscriptionBody.creditCardHolderInfo = {
            name,
            email,
            cpfCnpj,
            postalCode: '14000000', // CEP fictício padrão ou do formulário
            addressNumber: '123',
            phone
          };
        }

        const subResponse = await fetch(`${baseUrl}/subscriptions`, {
          method: 'POST',
          headers: asaasHeaders,
          body: JSON.stringify(subscriptionBody)
        });

        const subData = await subResponse.json();
        if (subData.errors) {
          return res.status(400).json({ error: "Erro ao criar assinatura no Asaas", details: subData.errors });
        }

        return res.json({ 
          success: true, 
          message: "Assinatura registrada com sucesso!",
          subscriptionId: subData.id,
          invoiceUrl: subData.invoiceUrl
        });

      } else {
        // Criar Cobrança Única no Asaas (/v3/payments)
        const paymentBody: any = {
          customer: customerId,
          billingType: asaasPaymentMethod,
          value: parsedAmount,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 dias de validade
          description: `Compra: ${productName}`
        };

        if (asaasPaymentMethod === 'CREDIT_CARD' && creditCard) {
          paymentBody.creditCard = {
            holderName: creditCard.holderName,
            number: creditCard.number,
            expiryMonth: creditCard.expiryMonth,
            expiryYear: creditCard.expiryYear,
            ccv: creditCard.cvv
          };
          paymentBody.creditCardHolderInfo = {
            name,
            email,
            cpfCnpj,
            postalCode: '14000000',
            addressNumber: '123',
            phone
          };
        }

        const payResponse = await fetch(`${baseUrl}/payments`, {
          method: 'POST',
          headers: asaasHeaders,
          body: JSON.stringify(paymentBody)
        });

        const payData = await payResponse.json();
        if (payData.errors) {
          return res.status(400).json({ error: "Erro ao criar pagamento no Asaas", details: payData.errors });
        }

        // Se for Pix, precisamos pegar a chave Pix / QR Code
        if (asaasPaymentMethod === 'PIX') {
          const pixResponse = await fetch(`${baseUrl}/payments/${payData.id}/pixQrCode`, {
            method: 'GET',
            headers: asaasHeaders
          });
          const pixData = await pixResponse.json();

          return res.json({
            success: true,
            paymentId: payData.id,
            paymentMethod: 'PIX',
            pixCopyPaste: pixData.payload,
            pixQrCode: `data:image/png;base64,${pixData.encodedImage}`,
            invoiceUrl: payData.invoiceUrl
          });
        }

        return res.json({ 
          success: true, 
          paymentId: payData.id,
          paymentMethod: asaasPaymentMethod,
          invoiceUrl: payData.invoiceUrl,
          bankSlipUrl: payData.bankSlipUrl
        });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Erro ao processar o checkout no Asaas." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
