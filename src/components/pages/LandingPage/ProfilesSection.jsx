import React from 'react';
import ProfileCardList from './ProfileCardList';

const ProfilesSection = ({ profiles, setIsModalOpen }) => {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-center bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text mb-8 md:mb-12">
          Recently Added <br className="sm:hidden" /> Profiles
        </h2>

        <ProfileCardList setIsModalOpen={setIsModalOpen} profiles={profiles} />
      </div>
    </section>
  );
};

export default ProfilesSection;

