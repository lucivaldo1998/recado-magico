import { Lock } from 'lucide-react'

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
          <Lock className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Política de Privacidade</h1>
          <p className="text-sm text-gray-500">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-6">

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Compromisso com a Privacidade</h2>
          <p>
            O Recado Mágico está comprometido em proteger a privacidade de seus clientes. Esta Política
            descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais, em
            conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Dados Coletados</h2>
          <p>Coletamos as seguintes informações quando você utiliza nossos serviços:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
            <li><strong>Dados de identificação:</strong> nome do responsável, email, número de WhatsApp</li>
            <li><strong>Dados da criança:</strong> primeiro nome e idade (apenas para personalização do vídeo)</li>
            <li><strong>Dados de pagamento:</strong> processados diretamente pelo Mercado Pago — não armazenamos dados de cartão</li>
            <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, páginas visitadas</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Finalidade do Uso</h2>
          <p>Utilizamos seus dados para:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
            <li>Processar e entregar os vídeos personalizados solicitados</li>
            <li>Enviar comunicações sobre o seu pedido via WhatsApp ou email</li>
            <li>Processar pagamentos com segurança</li>
            <li>Melhorar nossos serviços e a experiência do usuário</li>
            <li>Cumprir obrigações legais e fiscais</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Compartilhamento de Dados</h2>
          <p>
            Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de
            marketing. Compartilhamos informações apenas com:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
            <li><strong>Mercado Pago:</strong> para processamento de pagamentos</li>
            <li><strong>Provedores de IA:</strong> para gerar o conteúdo personalizado dos vídeos (apenas dados estritamente necessários)</li>
            <li><strong>Autoridades públicas:</strong> quando exigido por lei</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Proteção dos Dados de Crianças</h2>
          <p>
            Tratamos os dados de crianças com cuidado especial. As informações fornecidas (nome e idade)
            são utilizadas exclusivamente para personalização do vídeo e nunca são compartilhadas para
            fins comerciais ou de marketing direto à criança.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não
            autorizado, alteração, divulgação ou destruição. Todas as transações de pagamento utilizam
            criptografia SSL e são processadas pelo Mercado Pago.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Seus Direitos (LGPD)</h2>
          <p>De acordo com a LGPD, você tem direito a:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
            <li>Confirmação da existência de tratamento dos seus dados</li>
            <li>Acesso aos dados que mantemos sobre você</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados</li>
            <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
            <li>Portabilidade dos dados a outro fornecedor</li>
            <li>Revogação do consentimento</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Cookies</h2>
          <p>
            Utilizamos cookies essenciais para o funcionamento do site e cookies de analytics para
            entender como os usuários interagem com a plataforma. Você pode desabilitar os cookies
            nas configurações do seu navegador.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">9. Retenção de Dados</h2>
          <p>
            Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas nesta
            Política e para cumprir obrigações legais e fiscais. Após esse período, os dados serão
            excluídos ou anonimizados.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contato</h2>
          <p>
            Para exercer seus direitos ou tirar dúvidas sobre esta Política, entre em contato pelo email{' '}
            <a href="mailto:contato@recadomagico.com" className="text-primary-600 hover:underline">
              contato@recadomagico.com
            </a>.
          </p>
        </section>

      </div>
    </div>
  )
}
