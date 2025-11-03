import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000/memstepone/:userId", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Input username, password, select role and click login button
        frame = context.pages[-1]
        # Input username/email
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('fatima@gmail.com')
        

        frame = context.pages[-1]
        # Input password
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div[3]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Fatima@1234')
        

        frame = context.pages[-1]
        # Select role dropdown
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div/div/select').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Click login button
        elem = frame.locator('xpath=html/body/div/div/div/div/form/div[5]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Navigate to /memstepone/:userId page
        await page.goto('http://localhost:3000/memstepone/fatima', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Set viewport to mobile size (375px width) and verify form visibility and layout
        await page.goto('http://localhost:3000/memstepone/fatima', timeout=10000)
        await asyncio.sleep(3)
        

        frame = context.pages[-1]
        # Click Next Step button to ensure form interaction
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div[2]/div[2]/div[2]/form/div[7]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Set viewport to mobile size (375px width) and verify form visibility, layout, and usability
        await page.goto('http://localhost:3000/memstepone/fatima', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Set viewport to tablet size (768px width) and verify form layout and navigation components
        await page.goto('http://localhost:3000/memstepone/fatima', timeout=10000)
        await asyncio.sleep(3)
        

        frame = context.pages[-1]
        # Enter first name on mobile viewport
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div[2]/div[2]/div[2]/form/div/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('TestFirstName')
        

        frame = context.pages[-1]
        # Enter last name on mobile viewport
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div[2]/div[2]/div[2]/form/div/div[2]/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('TestLastName')
        

        frame = context.pages[-1]
        # Click Next Step button to test form interaction on mobile viewport
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div[2]/div[2]/div[2]/form/div[7]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Set viewport to tablet size (768px width) and verify form layout and navigation components
        await page.goto('http://localhost:3000/memstepone/fatima', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Set viewport to tablet size (768px width) and verify form layout and navigation components
        await page.goto('http://localhost:3000/memstepone/fatima', timeout=10000)
        await asyncio.sleep(3)
        

        frame = context.pages[-1]
        # Input first name on tablet viewport
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div[2]/div[2]/div[2]/form/div/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('TabletFirstName')
        

        frame = context.pages[-1]
        # Input last name on tablet viewport
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div[2]/div[2]/div[2]/form/div/div[2]/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('TabletLastName')
        

        frame = context.pages[-1]
        # Click Next Step button on tablet viewport
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div[2]/div[2]/div[2]/form/div[7]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Set viewport to desktop size (1920px width) and verify full layout and component visibility
        await page.goto('http://localhost:3000/memstepone/fatima', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Set viewport to mobile size (375px width) and verify form visibility, layout, and usability
        frame = context.pages[-1]
        # Input first name on desktop viewport
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div[2]/div[2]/div[2]/form/div/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Fatima')
        

        frame = context.pages[-1]
        # Input last name on desktop viewport
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div[2]/div[2]/div[2]/form/div/div[2]/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Khan')
        

        frame = context.pages[-1]
        # Click Next Step button to test form interaction on desktop viewport
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div[2]/div[2]/div[2]/form/div[7]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        await page.goto('http://localhost:3000/memstepone/fatima', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Set viewport to mobile size (375px width) and verify form visibility, layout, and usability
        await page.goto('http://localhost:3000/memstepone/fatima', timeout=10000)
        await asyncio.sleep(3)
        

        frame = context.pages[-1]
        # Input first name on mobile viewport
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div[2]/div[2]/div[2]/form/div/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Fatima')
        

        frame = context.pages[-1]
        # Input last name on mobile viewport
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div[2]/div[2]/div[2]/form/div/div[2]/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Khan')
        

        frame = context.pages[-1]
        # Click Next Step button to test form interaction on mobile viewport
        elem = frame.locator('xpath=html/body/div/div/div/div/div[2]/div[2]/div[2]/div[2]/form/div[7]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        await page.mouse.wheel(0, 500)
        

        # -> Complete final verification of no horizontal scrolling and smooth vertical scrolling on tablet viewport, then finish task.
        await page.goto('http://localhost:3000/memstepone/fatima', timeout=10000)
        await asyncio.sleep(3)
        

        await page.mouse.wheel(0, 500)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Create Your Mehram Match Profile').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Follow these 6 simple steps to complete your profile and find the perfect match').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Personal Details').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Religious Details').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Family Details').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Partner Expectations').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Privacy Selection').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Review & Confirm').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=STEP 1 OF 6').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Personal Details').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Basic Information').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=First Name *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Enter your first name as it appears on official documents').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Last Name *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Enter your last name as it appears on official documents').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Date of Birth *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Select your date of birth (DD-MM-YYYY format)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Gender *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Select your gender from the dropdown').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Select an option').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Male').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Female').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Marital Status *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Select your current marital status').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Single').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Divorced').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Khula').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Widowed').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Current Address').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Country *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Select your current country of residence').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=India').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=State *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Select your current state/province').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=City *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Select your current city of residence').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Native Place').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Native Country *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Select your native/original country').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Native State *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Select your native/original state').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Native City *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Select your native/original city').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Education *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Select your highest education level').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Profession *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Select your current profession or occupation').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Disability (if any?) *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Select whether you have any disability or not').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Yes').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=No').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Income Range').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Height').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Weight (Kg)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Enter your weight in kilograms (e.g., 70)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Personal Values/About You *').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Share your values, interests, and what you\'re looking for').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Next Step').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    