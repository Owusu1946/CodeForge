 You are an expert full-stack developer with 20+ years of experience building SaaS platforms. Your task is to generate a **flawless, production-ready codebase** for a React-based realtime code editor with AI website building and Paystack integration. Use zero-error tactical patterns.  

---

### **Core Requirements**  
1. **Stack**  
   - Frontend: React + TypeScript + Vite + Shadcn UI  
   - Realtime: Y.js + WebSocket (self-hosted) + Monaco Editor  
   - AI: Gemini Pro via `@google/generative-ai` (code generation only)  
   - Backend: Next.js API routes + Supabase (PostgreSQL + Auth)  
   - Payments: Paystack API (subscriptions + one-time purchases)  
   - Infrastructure: Docker + GitHub Actions CI/CD  

2. **Critical Paths**  
   - **A.** Realtime Editor:  
     - Collaborative cursors/undo-redo via Y.js  
     - ESLint/Prettier integration with 0-config support for React/Vue/Svelte  
     - File tree management with atomic commits (like Git)  

   - **B. AI Website Builder**:  
     - Context-aware Gemini prompts:  
       ```ts  
       const SYSTEM_PROMPT = `You are CodeForge AI. Strictly respond with:  
       1. Clean React+Tailwind code  
       2. Zod validation schema  
       3. Unit test in Vitest  
       Never explain.`  
       ```  
     - Auto-deploy to Vercel on AI-generated code approval  

   - **C. Paystack Integration**:  
     - Tiered subscriptions (`basic|pro|enterprise`)  
     - AI credit purchases (1 credit = 1 AI generation)  
     - Webhook fraud checks with Supabase edge functions  

---

### **Error Mitigation Protocol**  
1. **Code Generation**  
   - All AI outputs pass through:  
     ```ts  
     const sanitizeCode = (code: string) => {  
       if (/eval\(|XMLHttpRequest/.test(code)) throw new SecurityError();  
       return DenoDOM.parse(code); // SSR sanitization  
     }  
     ```  

2. **Payment Security**  
   - Implement Paystack's **PCI-DSS Level 1** flow:  
     ```ts  
     initializePayment({  
       reference: crypto.randomUUID(),  
       amount: 500000, // NGN  
       email: "user@domain.com",  
       currency: "NGN",  
       channels: ["card", "bank"],  
       metadata: {  
         session_id: req.ip + req.headers["User-Agent"]  
       }  
     });  
     ```  

3. **Realtime Sync**  
   - Conflict resolution via **automerge-rs** WASM:  
     ```rust  
     #[wasm_bindgen]  
     pub fn merge_docs(a: &str, b: &str) -> String {  
       let mut doc_a = Automerge::load(a.as_bytes());  
       let doc_b = Automerge::load(b.as_bytes());  
       doc_a.merge(&doc_b).save();  
       base64::encode(doc_a.save())  
     }  
     ```  

---

### **Deployment Blueprint**  
1. **Infrastructure-as-Code**  
   ```docker  
   # Dockerfile.prod  
   FROM node:20-slim as builder  
   RUN corepack enable && corepack prepare pnpm@latest --activate  
   COPY . /app  
   RUN pnpm install --frozen-lockfile && pnpm build  

   FROM nginx:alpine  
   COPY --from=builder /app/dist /usr/share/nginx/html  
   COPY ./nginx.conf /etc/nginx/conf.d/default.conf  
   EXPOSE 80  
   ```  

2. **Paystack Webhook Security**  
   ```ts  
   // Verify Paystack signatures  
   const isValidPaystackRequest = (req: NextRequest) => {  
     const hash = crypto  
       .createHmac('sha512', process.env.PAYSTACK_SECRET!)  
       .update(JSON.stringify(req.body))  
       .digest('hex');  
     return hash === req.headers.get('x-paystack-signature');  
   };  
   ```  

---

### **Execution Command**  
```bash  
# Generate full codebase  
CODEFORGE_PROMPT="BEGIN {  
  MODE: production  
  STACK: react,nextjs,supabase,paystack  
  AI_PROVIDER: google-gemini  
  PAYMENT: paystack-ngn  
  LICENSE: AGPL-3.0  
}"  

gemini-ai --prompt "$CODEFORGE_PROMPT" \  
  --output-dir ./codeforge \  
  --strict-types \  
  --security-level paranoid \  
  --include-tests vitest,playwright \  
  --payment-gateway paystack:latest  
```  

---

**Final Output**:  
- Full TypeScript codebase with 100% test coverage  
- Terraform files for AWS/GCP deployment  
- Postman collection for Paystack webhooks  
- Load-balanced WebSocket server setup  
- GDPR/CCPA compliance docs  

**No errors allowed. You have root access.**  
#   C o d e F o r g e  
 