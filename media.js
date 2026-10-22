(() => {
  'use strict';
  const library=window.PREM_VIDEO_LIBRARY;
  const names={domino:'DOMINO',rmbench:'RMBench M(1)',liberopro:'LIBERO-Pro'};
  const secondsLabel=seconds=>{const n=Math.round(seconds);return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;};
  for(const [group,clips] of Object.entries(library)){
    const panel=document.getElementById(`film-${group}`),defaultSpeed=1;
    const deliveryRates=[...new Set(clips.map(clip=>clip.fps))].sort((a,b)=>a-b);
    const toolbar=document.createElement('div');toolbar.className='media-toolbar';
    const status=document.createElement('div'),fps=document.createElement('span'),rateNote=document.createElement('span');
    fps.className='source-fps';fps.textContent=`${deliveryRates.join(' / ')} fps`;status.append(fps,rateNote);
    const label=document.createElement('label');label.textContent='Playback ';
    const speed=document.createElement('select');speed.setAttribute('aria-label',`${names[group]} playback speed`);
    for(const value of [0.5,1,2,4]){const option=document.createElement('option');option.value=value;option.textContent=`${value}×`;option.selected=value===defaultSpeed;speed.append(option);}
    label.append(speed);toolbar.append(status,label);
    const grid=document.createElement('div');grid.className='rollout-grid';grid.setAttribute('aria-label',`${names[group]} rollout videos`);
    const videos=[];
    clips.forEach((clip,i)=>{
      const card=document.createElement('article');card.className='rollout-card';if(clip.width/clip.height>3)card.classList.add('wide-clip');
      const player=document.createElement('div');player.className='rollout-player';
      const video=document.createElement('video');video.src=clip.src;video.poster=clip.poster;video.controls=true;video.muted=true;video.playsInline=true;video.preload='metadata';video.setAttribute('aria-label',`${names[group]} — ${clip.title}`);video.setAttribute('aria-describedby',`rollout-caption-${group}-${i}`);
      const fallback=document.createElement('a');fallback.href=clip.src;fallback.textContent='Open video file';video.append(fallback);
      const playButton=document.createElement('button');playButton.type='button';playButton.className='rollout-play';playButton.setAttribute('aria-label',`Play ${names[group]}: ${clip.title}`);playButton.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z"/></svg>';playButton.addEventListener('click',()=>video.play().catch(()=>{error.hidden=false;}));
      video.addEventListener('play',()=>{playButton.hidden=true;});video.addEventListener('pause',()=>{playButton.hidden=false;});video.addEventListener('ended',()=>{playButton.hidden=false;});player.append(video,playButton);
      const caption=document.createElement('div');caption.className='rollout-info';caption.id=`rollout-caption-${group}-${i}`;
      const heading=document.createElement('h3');heading.textContent=clip.title;const duration=document.createElement('span');duration.textContent=secondsLabel(clip.duration);duration.title=`${clip.fps} fps${clip.interpolated?` · Motion-interpolated from ${clip.sourceFps} fps`:' · Original recording'}`;caption.append(heading,duration);
      const error=document.createElement('p');error.className='media-error';error.hidden=true;error.textContent='Unable to play this clip. ';const open=document.createElement('a');open.href=clip.src;open.textContent='Open original';error.append(open);
      video.addEventListener('error',()=>{error.hidden=false;});
      video.addEventListener('loadedmetadata',()=>{video.playbackRate=Number(speed.value);});
      video.addEventListener('play',()=>{video.playbackRate=Number(speed.value);document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();});});
      card.append(player,caption,error);grid.append(card);videos.push(video);video.defaultPlaybackRate=defaultSpeed;video.playbackRate=defaultSpeed;
    });
    function updateRate(){const rate=Number(speed.value);videos.forEach(v=>{v.defaultPlaybackRate=rate;v.playbackRate=rate;});rateNote.textContent=rate===1?'Original timing':`${rate}× playback · ${rate>1?'accelerated':'slowed'}`;}
    speed.addEventListener('change',updateRate);updateRate();
    const note=document.createElement('p');note.className='media-note';note.textContent='Lower-frame-rate recordings are motion-interpolated to 30 fps. Original timing is preserved.';
    panel.append(toolbar,grid,note);
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)document.querySelectorAll('video').forEach(v=>v.pause());});
})();
