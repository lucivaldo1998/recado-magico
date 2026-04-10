import { RefreshCw } from 'lucide-react'

export default function Refund() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Política de Reembolso</h1>
          <p className="text-sm text-gray-500">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-6">

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Compromisso com a Satisfação</h2>
          <p>
            No Recado Mágico, nosso objetivo é proporcionar momentos mágicos e inesquecíveis para
            crianças e suas famílias. Sua satisfação é a nossa prioridade. Esta Política de Reembolso
            esclarece as condições para devolução e ressarcimento.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Direito de Arrependimento</h2>
          <p>
            Conforme o Código de Defesa do Consumidor (Art. 49), o cliente tem o direito de desistir
            da compra em até <strong>7 dias corridos</strong> após a confirmação do pedido, desde que
            o vídeo personalizado <strong>ainda não tenha sido produzido e enviado</strong>.
          </p>
          <p className="mt-2">
            Como nossos vídeos são personalizados e a produção começa em até 24h após o pagamento, o
            direito de arrependimento se aplica somente enquanto o pedido estiver com status "Aguardando
            produção". Após o envio do vídeo, por se tratar de produto personalizado e digital, não
            é possível o arrependimento.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Casos de Reembolso Integral</h2>
          <p>Garantimos reembolso integral nas seguintes situações:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
            <li>Não conseguirmos entregar o vídeo personalizado dentro do prazo de 24 horas (exceto em casos de força maior)</li>
            <li>O vídeo entregue apresentar erros graves de personalização (nome incorreto, mensagem totalmente diferente do solicitado)</li>
            <li>Falha técnica que impeça a entrega do vídeo</li>
            <li>Solicitação feita antes do início da produção (até 24h após o pedido)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Casos Não Elegíveis para Reembolso</h2>
          <p>Não realizamos reembolso nas seguintes situações:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
            <li>Vídeo já entregue com personalização correta conforme as informações fornecidas pelo cliente</li>
            <li>Insatisfação subjetiva (ex: "não gostei do tom", "esperava algo diferente") quando o vídeo está conforme as instruções</li>
            <li>Erros causados por informações incorretas fornecidas pelo cliente (nome digitado errado, idade incorreta, etc.)</li>
            <li>Vídeos baixados, salvos ou compartilhados pelo cliente</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Como Solicitar o Reembolso</h2>
          <p>Para solicitar reembolso, siga os passos abaixo:</p>
          <ol className="list-decimal list-inside space-y-2 mt-2 ml-2">
            <li>Entre em contato pelo email <a href="mailto:contato@recadomagico.com" className="text-primary-600 hover:underline">contato@recadomagico.com</a> ou pelo WhatsApp</li>
            <li>Informe o código do pedido e o motivo do reembolso</li>
            <li>Anexe evidências (prints, descrição do problema), se aplicável</li>
            <li>Aguarde nossa análise — respondemos em até 48 horas úteis</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Prazo de Estorno</h2>
          <p>
            Após a aprovação do reembolso, o estorno será realizado no mesmo método de pagamento
            utilizado na compra:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
            <li><strong>Cartão de crédito:</strong> o estorno aparecerá na próxima fatura, em até 2 ciclos de faturamento (depende da operadora do cartão)</li>
            <li><strong>PIX:</strong> devolução em até 5 dias úteis na conta de origem</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Refazer o Vídeo</h2>
          <p>
            Como alternativa ao reembolso, em caso de erro causado por nós (não por dado incorreto
            do cliente), podemos refazer o vídeo gratuitamente, ajustando o que estiver fora do
            esperado.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contato</h2>
          <p>
            Para qualquer dúvida ou solicitação relacionada a reembolso, entre em contato:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
            <li>Email: <a href="mailto:contato@recadomagico.com" className="text-primary-600 hover:underline">contato@recadomagico.com</a></li>
            <li>WhatsApp: disponível no rodapé do site</li>
            <li>Instagram: <a href="https://www.instagram.com/recado.magico/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">@recado.magico</a></li>
          </ul>
        </section>

      </div>
    </div>
  )
}
