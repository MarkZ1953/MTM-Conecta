import { useState } from 'react'
import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import AboutSection from '@/components/landing/AboutSection'
import WhatWeDoSection from '@/components/landing/WhatWeDoSection'
import ProjectsSection from '@/components/landing/ProjectsSection'
import HowToHelpSection from '@/components/landing/HowToHelpSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import ContactSection from '@/components/landing/ContactSection'
import Footer from '@/components/landing/Footer'
import Modal from '@/components/ui/Modal'
import DonateForm from '@/components/forms/DonateForm'
import VolunteerForm from '@/components/forms/VolunteerForm'
import PartnerForm from '@/components/forms/PartnerForm'

export default function Index() {
  const [openModal, setOpenModal] = useState<string | null>(null)

  const handleOpenModal = (type: string) => setOpenModal(type)
  const handleCloseModal = () => setOpenModal(null)

  return (
    <div className="min-h-screen bg-background">
      <Navbar onDonate={() => handleOpenModal('donate')} />
      <HeroSection 
        onDonate={() => handleOpenModal('donate')} 
        onVolunteer={() => handleOpenModal('volunteer')} 
      />
      <AboutSection />
      <WhatWeDoSection />
      <ProjectsSection />
      <HowToHelpSection onOpenModal={handleOpenModal} />
      <TestimonialsSection />
      <ContactSection onOpenContact={() => handleOpenModal('contact')} />
      <Footer onDonate={() => handleOpenModal('donate')} />

      {/* Modals */}
      <Modal
        isOpen={openModal === 'donate'}
        onClose={handleCloseModal}
        title="Hacer una Donación"
      >
        <DonateForm onClose={handleCloseModal} />
      </Modal>

      <Modal
        isOpen={openModal === 'volunteer'}
        onClose={handleCloseModal}
        title="Ser Voluntario"
      >
        <VolunteerForm onClose={handleCloseModal} />
      </Modal>

      <Modal
        isOpen={openModal === 'partner'}
        onClose={handleCloseModal}
        title="Alianza Empresarial"
      >
        <PartnerForm onClose={handleCloseModal} />
      </Modal>
    </div>
  )
}
