import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import i18n from '../../lib/i18n/i18n'
import { useTranslation } from 'react-i18next'
import { Button } from './button'
import { AnimatedGroup } from './animated-group'
import { ThemeToggle } from './theme-toggle'
import { RainbowButton } from './rainbow-button'
import { cn } from '../../lib/utils'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    const { t } = useTranslation('homepage');
    
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <div
                    aria-hidden
                    className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
                    <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section>
                    <div className="relative pt-24 md:pt-36">
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                item: {
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            type: 'spring',
                                            bounce: 0.3,
                                            duration: 2,
                                        },
                                    },
                                },
                            }}
                            className="absolute inset-0 -z-20">
                            <img
                                src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=3276&h=4095&q=80"
                                alt="background"
                                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block opacity-30"
                                width="3276"
                                height="4095"
                            />
                        </AnimatedGroup>
                        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        to="/auth"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-sm">{t('trust.subtitle')}</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                        
                                    <h1
                                        className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem] font-bold leading-tight text-foreground">
                                        {t('hero.title')}
                                    </h1>
                                    <p
                                        className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground">
                                        {t('hero.subtitle')}
                                    </p>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <div
                                        key={1}
                                        className="bg-foreground/10 rounded-[14px] border p-0.5">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base">
                                            <Link to="/auth">
                                                <span className="text-nowrap">{t('nav.getStarted')}</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <RainbowButton
                                        key={2}
                                        onClick={() => window.location.href = '/auth'}
                                        className="h-11 px-5">
                                        <span className="text-nowrap">{t('hero.browse')}</span>
                                    </RainbowButton>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                                <div
                                    aria-hidden
                                    className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                                />
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                                    <div className="aspect-15/8 relative rounded-2xl bg-card shadow-2xl flex">
                                        {/* Sidebar */}
                                        <div className="w-16 bg-sidebar-background border-r border-sidebar-border flex flex-col items-center py-4 space-y-3">
                                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                                <span className="text-primary-foreground font-bold text-xs">nb</span>
                                            </div>
                                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house w-4 h-4 text-primary">
                                                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                                                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                                </svg>
                                            </div>
                                            <div className="w-8 h-8 bg-sidebar-accent rounded-lg flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase w-4 h-4 text-sidebar-accent-foreground">
                                                    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                                    <rect width="20" height="14" x="2" y="6" rx="2"></rect>
                                                </svg>
                                            </div>
                                            <div className="w-8 h-8 bg-sidebar-background rounded-lg flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square w-4 h-4 text-sidebar-foreground">
                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                </svg>
                                            </div>
                                            <div className="w-8 h-8 bg-sidebar-background rounded-lg flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-column w-4 h-4 text-sidebar-foreground">
                                                    <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                                                    <path d="M18 17V9"></path>
                                                    <path d="M13 17V5"></path>
                                                    <path d="M8 17v-3"></path>
                                                </svg>
                                            </div>
                                            <div className="w-8 h-8 bg-sidebar-background rounded-lg flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-4 h-4 text-sidebar-foreground">
                                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="9" cy="7" r="4"></circle>
                                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        
                                        {/* Main Content */}
                                        <div className="flex-1 flex flex-col">
                                            {/* Header */}
                                            <div className="border-b border-sidebar-border p-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-semibold text-foreground">{t('dashboard.title')}</h3>
                                                    <div className="flex space-x-2">
                                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-1 mt-3">
                                                    <button className="px-3 py-1 bg-gradient-to-t from-primary to-primary-dark text-primary-foreground shadow-sm shadow-primary/50 rounded text-xs font-medium">{t('footer.engineers.title')}</button>
                                                    <button className="px-3 py-1 bg-muted text-muted-foreground rounded text-xs font-medium">{t('footer.clients.title')}</button>
                                                    <button className="px-3 py-1 bg-muted text-muted-foreground rounded text-xs font-medium">{t('footer.clients.enterprise')}</button>
                                                </div>
                                            </div>

                                            {/* Content Area */}
                                            <div className="flex-1 p-4 space-y-4 overflow-hidden">
                                                {/* Stats Grid */}
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="bg-primary/10 rounded-lg p-2">
                                                        <div className="text-xs text-muted-foreground">{t('dashboard.features.realtime')}</div>
                                                        <div className="text-sm font-bold text-primary">8</div>
                                                    </div>
                                                    <div className="bg-primary/10 rounded-lg p-2">
                                                        <div className="text-xs text-muted-foreground">{t('dashboard.features.milestone')}</div>
                                                        <div className="text-sm font-bold text-primary">SAR 18.5K</div>
                                                    </div>
                                                    <div className="bg-primary/10 rounded-lg p-2">
                                                        <div className="text-xs text-muted-foreground">{t('hero.title').substring(0, 6)}</div>
                                                        <div className="text-sm font-bold text-primary">4.8★</div>
                                                    </div>
                                                </div>

                                                {/* Activity Chart */}
                                                <div className="bg-muted rounded-lg p-2 flex items-end space-x-1 h-12">
                                                    <div className="bg-primary h-4 w-2 rounded-t"></div>
                                                    <div className="bg-primary h-6 w-2 rounded-t"></div>
                                                    <div className="bg-primary h-3 w-2 rounded-t"></div>
                                                    <div className="bg-primary h-5 w-2 rounded-t"></div>
                                                    <div className="bg-primary h-7 w-2 rounded-t"></div>
                                                    <div className="bg-primary h-4 w-2 rounded-t"></div>
                                                    <div className="bg-primary h-5 w-2 rounded-t"></div>
                                                </div>

                                                {/* Recent Jobs */}
                                                <div className="space-y-2">
                                                    <div className="text-xs text-muted-foreground font-medium">{t('footer.engineers.browseJobs')}</div>
                                                    <div className="space-y-1 max-h-20 overflow-hidden">
                                                        <div className="flex items-center space-x-2 text-xs p-1 bg-muted/50 rounded">
                                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                            <span className="text-foreground truncate">{i18n.language === 'en' ? 'Site Inspection - Riyadh' : 'تفتيش موقع - الرياض'}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-xs p-1 bg-muted/50 rounded">
                                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                                            <span className="text-foreground truncate">{i18n.language === 'en' ? 'Electrical Design - Jeddah' : 'تصميم كهربائي - جدة'}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-xs p-1 bg-muted/50 rounded">
                                                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                                                            <span className="text-foreground truncate">{i18n.language === 'en' ? 'HVAC Review - Dammam' : 'مراجعة تكييف - الدمام'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quick Actions */}
                                                <div className="space-y-2">
                                                    <div className="text-xs text-muted-foreground font-medium">{i18n.language === 'en' ? 'Quick Actions' : 'إجراءات سريعة'}</div>
                                                    <div className="flex space-x-2">
                                                        <button className="flex-1 bg-primary text-primary-foreground text-xs py-1 px-2 rounded text-center">{i18n.language === 'en' ? 'New Quote' : 'عرض سعر جديد'}</button>
                                                        <button className="flex-1 bg-muted text-muted-foreground text-xs py-1 px-2 rounded text-center border border-sidebar-border">{i18n.language === 'en' ? 'Check-in' : 'تسجيل الدخول'}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
            </main>
        </>
    )
}

const HeroHeader = () => {
    const { t } = useTranslation('homepage');
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    const menuItems = [
        { name: t('nav.features'), href: '#features' },
        { name: t('nav.pricing'), href: '#pricing' },
        { name: t('nav.about'), href: '#about' },
        { name: t('nav.contact'), href: '#contact' },
    ]

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2 group">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                to="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            to={item.href}
                                            className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                to={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex items-center space-x-2 md:space-x-4 header-buttons">
                                {/* Language Toggle */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}
                                    className="h-8 hidden sm:flex"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
                                        <path className="st0" d="M2,16c0.1,0,8-5,9-7c0.6-1.3,1-5,1-5h3H1h7V1"/>
                                        <line className="st0" x1="4" y1="8" x2="12" y2="16"/>
                                        <polygon className="st0" points="15,19 21,19 23,23 18,11 13,23 "/>
                                    </svg>
                                    {i18n.language === 'en' ? 'عربي' : 'EN'}
                                </Button>

                                {/* Theme Toggle - Hidden on mobile */}
                                <div className="hidden sm:block">
                                    <ThemeToggle />
                                </div>

                                {/* Auth Button - Smaller on mobile */}
                                <Link to="/auth" className="hidden sm:block">
                                    <Button size="sm">
                                        {i18n.language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
                                    </Button>
                                </Link>

                                {/* Mobile Menu Button */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="md:hidden h-9 w-9 p-0"
                                    onClick={() => setMenuState(!menuState)}
                                >
                                    {menuState ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">nb</span>
            </div>
            <span className="text-xl font-bold text-foreground">nbcon</span>
        </div>
    )
}
