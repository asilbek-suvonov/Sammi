import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function HeroMinimal() {
  return (
    <div className='relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4'>
      <div className='mx-auto max-w-4xl text-center'>
        <h1 className='text-3xl font-bold tracking-tight sm:text-7xl'>
          Dasturlashni o'rganishning eng oson usuli
        </h1>

        <p className='mt-6 text-lg leading-8 text-muted-foreground'>
          Tajribali mentorlardan amaliy bilimlar. Har bir darsdan keyin real
          loyihalar.
        </p>

        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <Button className='group'>
            Boshlash
            <ArrowRight className='ml-2 size-4 transition group-hover:translate-x-1' />
          </Button>
          <Button variant='link'>Ko'proq →</Button>
        </div>

        {/* Simple stats */}
        <div className='mt-16 flex justify-center gap-8 text-sm text-muted-foreground'>
          <div>5000+ o'quvchi</div>
          <div>200+ dars</div>
          <div>15+ loyiha</div>
        </div>
      </div>
    </div>
  )
}
