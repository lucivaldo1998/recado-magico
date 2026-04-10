import { FileText } from 'lucide-react'

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
          <FileText className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Termos de Uso</h1>
          <p className="text-sm text-gray-500">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-6">

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e utilizar o site Recado Mágico ("Plataforma"), você concorda em cumprir e estar
            vinculado aos presentes Termos de Uso. Caso não concorde com qualquer disposição, recomendamos
            que não utilize nossos serviços.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Descrição do Serviço</h2>
          <p>
            O Recado Mágico oferece a criação de vídeos personalizados onde personagens infantis enviam
            mensagens com o nome e detalhes da criança. Os vídeos são entregues digitalmente via WhatsApp
            ou email em até 24 horas após a confirmação do pagamento.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Cadastro e Dados do Usuário</h2>
          <p>
            Para realizar uma compra, o usuário deverá fornecer informações verdadeiras, completas e
            atualizadas, incluindo nome do responsável, email, WhatsApp e detalhes da criança. O
            usuário é responsável pela exatidão dos dados fornecidos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Pagamento</h2>
          <p>
            Os pagamentos são processados de forma segura pelo Mercado Pago, aceitando cartão de crédito
            e PIX. O pedido só será iniciado após a confirmação do pagamento. Os preços estão expressos
            em Reais (BRL).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Entrega</h2>
          <p>
            Os vídeos personalizados serão entregues no WhatsApp informado em até 24 horas após a
            confirmação do pagamento. Em casos excepcionais (alto volume de pedidos, datas comemorativas),
            o prazo pode ser estendido, sendo o usuário comunicado.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Uso Pessoal e Não Comercial</h2>
          <p>
            Os vídeos adquiridos são para uso pessoal e familiar. É proibida a revenda, redistribuição
            ou uso comercial dos vídeos sem autorização prévia e por escrito do Recado Mágico.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo da Plataforma — incluindo textos, imagens, vídeos, marca e código — é de
            propriedade do Recado Mágico ou de seus licenciadores e é protegido pelas leis de direitos
            autorais. É proibida qualquer cópia, modificação ou distribuição sem autorização.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Limitação de Responsabilidade</h2>
          <p>
            O Recado Mágico não se responsabiliza por interrupções temporárias do serviço, falhas de
            conexão ou problemas técnicos fora de seu controle. Nosso compromisso é com a entrega do
            vídeo personalizado conforme solicitado pelo usuário.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">9. Alterações dos Termos</h2>
          <p>
            Reservamo-nos o direito de modificar estes Termos a qualquer momento, sendo as alterações
            publicadas nesta página. O uso contínuo do serviço após a publicação implica concordância
            com os novos termos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contato</h2>
          <p>
            Para dúvidas sobre estes Termos, entre em contato pelo email{' '}
            <a href="mailto:contato@recadomagico.com" className="text-primary-600 hover:underline">
              contato@recadomagico.com
            </a>{' '}
            ou pelo nosso WhatsApp.
          </p>
        </section>

      </div>
    </div>
  )
}
