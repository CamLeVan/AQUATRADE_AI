import sys
import os
sys.path.append(r'd:\VKU_learning\HK5\AiForLife\fish\SmartFingerlingTracker\fish')

try:
    from fish_counter import FishCounter
    import logging

    # Setup logging
    logging.basicConfig(level=logging.INFO)

    print("Initializing FishCounter...")
    # Mocking YOLO to avoid loading the model which might fail or take time
    # We only want to test the biomass logic
    class MockYOLO:
        def __init__(self, model_path):
            self.conf = 0.25
    
    # Patching YOLO temporarily if needed, but FishCounter loads it in __init__
    # Let's try to instantiate it. If it fails due to model not found, we might need to mock it better.
    # Assuming best.pt exists as per previous exploration.
    
    counter = FishCounter()
    
    print("\nTesting Biomass Calculation:")
    print("-" * 30)
    
    # Test Class 0 (ca_nho)
    # Params: a=0.001, b=1.5
    area_0 = 1000
    expected_weight_0 = 0.001 * (1000 ** 1.5)
    weight_0 = counter.calculate_biomass(area_0, 0)
    print(f"Class 0 (Area={area_0}): Expected={expected_weight_0:.2f}, Got={weight_0:.2f}")
    
    # Test Class 1 (ca_vua)
    # Params: a=0.002, b=1.45
    area_1 = 2000
    expected_weight_1 = 0.002 * (2000 ** 1.45)
    weight_1 = counter.calculate_biomass(area_1, 1)
    print(f"Class 1 (Area={area_1}): Expected={expected_weight_1:.2f}, Got={weight_1:.2f}")
    
    # Test Default Class (Unknown)
    weight_default = counter.calculate_biomass(area_0, 99)
    print(f"Class 99 (Default to 0): Got={weight_default:.2f}")
    
    print("-" * 30)
    print("Verification Complete!")

except Exception as e:
    print(f"Verification Failed: {e}")
