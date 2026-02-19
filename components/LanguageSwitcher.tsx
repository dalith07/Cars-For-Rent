'use client';

import { Globe } from 'lucide-react'
import { useLanguage } from '@/app/language-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const LanguageSwitch = () => {
    const { language, setLanguage, dir } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="
    flex items-center justify-center
     w-10 h-10
    rounded-full
    border border-border
    bg-background
    text-foreground
    hover:bg-accent
    hover:text-accent-foreground
    transition-all duration-300
     hover:cursor-pointer
  "
                >
                    <Globe size={20} className=' group-hover:scale-110 group-hover:rotate-360 duration-500' />
                </button>


            </DropdownMenuTrigger>

            <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'}>
                <DropdownMenuItem
                    onClick={() => setLanguage('en')}
                    className={language === 'en' ? 'bg-accent' : ''}
                >
                    English
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => setLanguage('fr')}
                    className={language === 'fr' ? 'bg-accent' : ''}
                >
                    Français
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => setLanguage('ar')}
                    className={language === 'ar' ? 'bg-accent' : ''}
                >
                    العربية
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default LanguageSwitch;
