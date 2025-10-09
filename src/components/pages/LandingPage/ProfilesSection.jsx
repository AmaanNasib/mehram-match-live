import React from 'react';
import LiteProfileCard from '../../elements&widgets/LiteProfileCard';

const ProfilesSection = ({ profiles, setIsModalOpen, onCardClick }) => {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-center bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text mb-8 md:mb-12">
          Recently Added <br className="sm:hidden" /> Profiles
        </h2>

        <div className="no-scrollbar overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 sm:gap-6 lg:gap-8 snap-x snap-mandatory">
            {profiles && profiles.length > 0 ? (
              profiles.map((p) => (
                <div key={p.id} className="flex-none w-[85%] sm:w-[320px] snap-start">
                  <LiteProfileCard profile={p} onClick={() => onCardClick && onCardClick(p)} />
                </div>
              ))
            ) : (
              <p className="text-center text-pink-600">No match found</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilesSection;

