import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: 'Como recebo o vídeo?',
    a: 'Após a confirmação do pagamento, nosso time produz o vídeo personalizado e envia diretamente para o WhatsApp que você informou, em até 24 horas.',
  },
  {
    q: 'Posso escolher o que o personagem vai falar?',
    a: 'Sim! No formulário de pedido, você descreve exatamente o que gostaria que o personagem dissesse, incluindo o nome da criança, idade e ocasião especial.',
  },
  {
    q: 'Para qual idade funciona?',
    a: 'Nossos vídeos encantam crianças de todas as idades, mas são especialmente mágicos para crianças de 2 a 10 anos.',
  },
  {
    q: 'Os personagens são licenciados?',
    a: 'Nossos personagens são criações originais e exclusivas, inspirados em arquétipos que as crianças amam — princesas, super-heróis, astronautas, fadas e muito mais.',
  },
  {
    q: 'Quais formas de pagamento são aceitas?',
    a: 'Aceitamos cartão de crédito (em até 3x sem juros) e PIX (pagamento instantâneo).',
  },
  {
    q: 'Posso dar de presente?',
    a: 'Com certeza! É o presente perfeito para aniversários, Dia das Crianças, Natal e qualquer data especial. Basta informar o WhatsApp de quem vai receber.',
  },
  {
    q: 'E se eu não gostar do resultado?',
    a: 'Oferecemos satisfação garantida. Se não ficar satisfeito, entre em contato pelo WhatsApp e resolveremos da melhor forma possível.',
  },
  {
    q: 'Quanto tempo leva para receber?',
    a: 'O prazo de entrega é de até 24 horas após a confirmação do pagamento. Muitos pedidos são entregues ainda mais rápido!',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="section-title mb-2">Perguntas Frequentes</h1>
      <p className="section-subtitle mb-10">Tire todas as suas dúvidas sobre nossos vídeos mágicos</p>

      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <div key={i} className="card !p-0 overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-medium hover:bg-gray-50 transition-colors"
            >
              {faq.q}
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-gray-600 text-sm border-t">
                <p className="pt-3">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
